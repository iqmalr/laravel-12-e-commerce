<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Services\StaffService;
use Illuminate\Http\RedirectResponse;
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
     */
    public function index(): Response
    {
        $staff = $this->staffService->getAll();
        return Inertia::render('Staff/Index', compact('staff'));
    }
    public function create(): Response
    {
        return Inertia::render('Staff/Create');
    }
    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $this->staffService->create($request->validated());
        return redirect()->route('staff.index')->with('success', 'Staff created successfully.');
    }
    public function edit($id): Response
    {
        $staff = $this->staffService->find($id);
        return Inertia::render('Staff/Edit', compact('staff'));
    }
    public function update(UpdateStaffRequest $request, $id): RedirectResponse
    {
        $this->staffService->update($id, $request->validated());

        return redirect()->route('staff.index')->with('success', 'Staff updated successfully.');
    }
    public function destroy($id): RedirectResponse
    {
        $this->staffService->delete($id);
        return redirect()->route('staff.index')->with('success', 'Staff deleted successfully.');
    }
    public function restore($id): RedirectResponse
    {
        $this->staffService->restore($id);
        return redirect()->route('staff.index')->with('success', 'Staff restored successfully.');
    }
}
