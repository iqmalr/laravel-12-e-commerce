<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
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

        $useServerPagination = $request->boolean('server_pagination', false);

        if ($useServerPagination) {
            $staff = $this->staffService->getAllPaginated($filters);

            return Inertia::render('Staff/Index', [
                'staff' => $staff,
                'filters' => $filters,
                'serverPagination' => true,
            ]);
        }

        $staff = $this->staffService->getAll();

        return Inertia::render('Staff/Index', [
            'staff' => $staff,
            'filters' => $filters,
            'serverPagination' => false,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Staff/Create');
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->create($request->validated());

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member has been added successfully.');
    }

    public function edit($id): Response
    {
        $staff = $this->staffService->find($id);

        return Inertia::render('Staff/Edit', compact('staff'));
    }

    public function update(UpdateStaffRequest $request, $id): RedirectResponse
    {
        $this->staffService->update($id, $request->validated());

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member has been updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $staff = $this->staffService->find($id);

        $this->staffService->delete($id);

        return redirect()
            ->route('staff.index')
            ->with('success', "Staff member {$staff->name} has been deleted.");
    }

    public function restore($id): RedirectResponse
    {
        $staff = $this->staffService->findWithTrashed($id);

        $this->staffService->restore($id);

        return redirect()
            ->route('staff.index')
            ->with('success', "Staff member {$staff->name} has been restored.");
    }

    public function statistics(): JsonResponse
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
            'delete' => "Successfully deleted {$count} staff member(s).",
            'restore' => "Successfully restored {$count} staff member(s).",
            'activate' => "Successfully activated {$count} staff member(s).",
            default => "Action completed for {$count} staff member(s).",
        };

        return redirect()
            ->route('staff.index')
            ->with('success', $message);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        return $this->staffService->exportData($filters);
    }
}
