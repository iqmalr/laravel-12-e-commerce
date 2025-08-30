<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class StaffService
{
    /**
     * Get all staff members
     */
    public function getAll(): Collection
    {
        return User::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get paginated staff with filtering and sorting
     */
    public function getAllPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = User::withTrashed();

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            match ($filters['status']) {
                'active' => $query->whereNull('deleted_at'),
                'inactive' => $query->whereNotNull('deleted_at'),
                default => null, // 'all' - no filter needed
            };
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        $allowedSortFields = ['name', 'username', 'email', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Default page size
        $perPage = min($filters['per_page'] ?? 10, 100); // Max 100 items per page

        return $query->paginate($perPage);
    }

    public function find(string $id): User
    {
        return User::findOrFail($id);
    }

    public function findWithTrashed(string $id): Collection|Model|SoftDeletes
    {
        return User::withTrashed()->findOrFail($id);
    }

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }

    public function update(string $id, array $data): User
    {
        $staff = $this->find($id);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $staff->update($data);

        return $staff->refresh();
    }

    /**
     * Soft delete staff
     */
    public function delete(string $id): bool
    {
        $staff = $this->find($id);

        return $staff->delete();
    }

    /**
     * Restore soft deleted staff
     */
    public function restore(string $id): bool
    {
        $staff = $this->findWithTrashed($id);

        return $staff->restore();
    }

    /**
     * Permanently delete staff
     */
    public function forceDelete(string $id): bool
    {
        $staff = $this->findWithTrashed($id);

        return $staff->forceDelete();
    }

    /**
     * Get staff statistics
     */
    public function getStatistics(): array
    {
        $total = User::withTrashed()->count();
        $active = User::whereNull('deleted_at')->count();
        $inactive = User::whereNotNull('deleted_at')->count();

        // Recently added (last 30 days)
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $recentlyAdded = User::where('created_at', '>=', $thirtyDaysAgo)->count();

        // Growth rate calculation (comparing last 30 days vs previous 30 days)
        $sixtyDaysAgo = Carbon::now()->subDays(60);
        $previousPeriod = User::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();

        $growthRate = 0;
        if ($previousPeriod > 0) {
            $growthRate = (($recentlyAdded - $previousPeriod) / $previousPeriod) * 100;
        }

        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'recently_added' => $recentlyAdded,
            'growth_rate' => round($growthRate, 1),
        ];
    }

    /**
     * Bulk actions for multiple staff
     */
    public function bulkAction(string $action, array $staffIds): int
    {
        $query = User::withTrashed()->whereIn('id', $staffIds);

        return match ($action) {
            'delete' => $query->whereNull('deleted_at')->update(['deleted_at' => now()]),
            'restore' => $query->whereNotNull('deleted_at')->update(['deleted_at' => null]),
            'force_delete' => $query->forceDelete(),
            default => 0,
        };
    }

    /**
     * Search staff with advanced filters
     */
    public function search(array $criteria): Collection
    {
        $query = User::withTrashed();

        if (!empty($criteria['name'])) {
            $query->where('name', 'like', "%{$criteria['name']}%");
        }

        if (!empty($criteria['email'])) {
            $query->where('email', 'like', "%{$criteria['email']}%");
        }

        if (!empty($criteria['username'])) {
            $query->where('username', 'like', "%{$criteria['username']}%");
        }

        if (isset($criteria['status'])) {
            match ($criteria['status']) {
                'active' => $query->whereNull('deleted_at'),
                'inactive' => $query->whereNotNull('deleted_at'),
                default => null,
            };
        }

        if (!empty($criteria['created_from'])) {
            $query->where('created_at', '>=', $criteria['created_from']);
        }

        if (!empty($criteria['created_to'])) {
            $query->where('created_at', '<=', $criteria['created_to']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Export staff data
     */
    public function exportData(array $filters = [])
    {
        $filename = 'staff-export-' . now()->format('Y-m-d-H-i-s') . '.csv';

        $staff = $this->search($filters);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($staff) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'ID',
                'Name',
                'Username',
                'Email',
                'Status',
                'Created At',
                'Updated At',
                'Deleted At',
            ]);

            foreach ($staff as $member) {
                fputcsv($file, [
                    $member->id,
                    $member->name,
                    $member->username,
                    $member->email,
                    $member->deleted_at ? 'Inactive' : 'Active',
                    $member->created_at?->format('Y-m-d H:i:s'),
                    $member->updated_at?->format('Y-m-d H:i:s'),
                    $member->deleted_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
