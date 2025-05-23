<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $staff = User::where('role_id', 2)->get();
        $staff = User::withTrashed()->where('role_id', 2)->get();
        return Inertia::render('Staff/Index', compact('staff'));
    }
    public function create()
    {
        return Inertia::render('Staff/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => 2,
        ]);

        return redirect()->route('staff.index')->with('success', 'Admin created successfully.');
    }
    public function edit($id)
    {
        $staff = User::where('role_id', 2)->findOrFail($id);
        return Inertia::render('Staff/Edit', compact('staff'));
    }
    public function update(Request $request, $id)
    {
        $staff = User::where('role_id', 2)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $staff->update([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $staff->password,
        ]);

        return redirect()->route('staff.index')->with('success', 'Admin updated successfully.');
    }
    public function destroy($id)
    {
        $staff = User::where('role_id', 2)->findOrFail($id);
        $staff->delete();

        return redirect()->route('staff.index')->with('success', 'Admin deleted successfully.');
    }
    public function restore($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->restore();

        return redirect()->route('staff.index')->with('success', 'Staff berhasil dipulihkan.');
    }
}
