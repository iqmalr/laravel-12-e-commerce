<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Services\StaffService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    protected StaffService $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }

    /**
     * Display a listing of the resource.
     * Enhanced with optional server-side filtering and pagination
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'per_page', 'sort_by', 'sort_direction']);

        // Default to client-side handling (return all data)
        $useServerPagination = $request->boolean('server_pagination', false);

        if ($useServerPagination) {
            // Server-side pagination and filtering
            $staff = $this->staffService->getAllPaginated($filters);

            return Inertia::render('Staff/Index', [
                'staff' => $staff,
                'filters' => $filters,
                'serverPagination' => true,
            ]);
        }

        // Client-side handling (current implementation)
        $staff = $this->staffService->getAll();

        return Inertia::render('Staff/Index', [
            'staff' => $staff,
            'filters' => $filters,
            'serverPagination' => false,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Staff/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->create($request->validated());

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $staff = $this->staffService->find($id);

        return Inertia::render('Staff/Edit', compact('staff'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffRequest $request, $id): RedirectResponse
    {
        $this->staffService->update($id, $request->validated());

        return redirect()
            ->route('staff.index')
            ->with('success', 'Data staff berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage (soft delete).
     */
    public function destroy($id): RedirectResponse
    {
        $staff = $this->staffService->find($id);

        $this->staffService->delete($id);

        return redirect()
            ->route('staff.index')
            ->with('success', "Staff {$staff->name} berhasil dihapus.");
    }

    /**
     * Restore the specified resource (undo soft delete).
     */
    public function restore($id): RedirectResponse
    {
        $staff = $this->staffService->findWithTrashed($id);

        $this->staffService->restore($id);

        return redirect()
            ->route('staff.index')
            ->with('success', "Staff {$staff->name} berhasil dipulihkan.");
    }

    /**
     * Get staff statistics for dashboard or API
     */
    public function statistics(): \Illuminate\Http\JsonResponse
    {
        $stats = $this->staffService->getStatistics();

        return response()->json([
            'total' => $stats['total'],
            'active' => $stats['active'],
            'inactive' => $stats['inactive'],
            'recently_added' => $stats['recently_added'],
            'growth_rate' => $stats['growth_rate'] ?? 0,
        ]);
    }

    /**
     * Bulk actions for multiple staff members
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'action' => 'required|in:delete,restore,activate',
            'staff_ids' => 'required|array|min:1',
            'staff_ids.*' => 'exists:users,id',
        ]);

        $action = $request->input('action');
        $staffIds = $request->input('staff_ids');

        $count = $this->staffService->bulkAction($action, $staffIds);

        $message = match($action) {
            'delete' => "Berhasil menghapus {$count} staff.",
            'restore' => "Berhasil memulihkan {$count} staff.",
            'activate' => "Berhasil mengaktifkan {$count} staff.",
            default => "Aksi berhasil dilakukan pada {$count} staff.",
        };

        return redirect()
            ->route('staff.index')
            ->with('success', $message);
    }

    /**
     * Export staff data
     */
    public function export(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        return $this->staffService->exportData($filters);
    }
}
