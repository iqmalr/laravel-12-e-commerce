<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Services\StaffService;
use Inertia\Inertia;

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
    public function index()
    {
        $staff = $this->staffService->getAll();
        return Inertia::render('Staff/Index', compact('staff'));
    }
    public function create()
    {
        return Inertia::render('Staff/Create');
    }
    public function store(StoreStaffRequest $request)
    {
        $this->staffService->create($request->validated());
        return redirect()->route('staff.index')->with('success', 'Staff created successfully.');
    }
    public function edit($id)
    {
        $staff = $this->staffService->find($id);
        return Inertia::render('Staff/Edit', compact('staff'));
    }
    public function update(UpdateStaffRequest $request, $id)
    {
        $this->staffService->update($id, $request->validated());

        return redirect()->route('staff.index')->with('success', 'Staff updated successfully.');
    }
    public function destroy($id)
    {
        $this->staffService->delete($id);
        return redirect()->route('staff.index')->with('success', 'Staff deleted successfully.');
    }
    public function restore($id)
    {
        $this->staffService->restore($id);
        return redirect()->route('staff.index')->with('success', 'Staff restored successfully.');
    }
}
