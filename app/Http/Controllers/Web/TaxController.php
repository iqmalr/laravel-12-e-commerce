<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TaxController extends Controller
{
    public function index()
    {
        $tax = Tax::withTrashed()->get();
        return Inertia::render('Tax/Index', compact('tax'));
    }

    public function create()
    {
        return Inertia::render('Tax/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage' => 'required|integer|min:0|max:100',
            // 'valid_from' => 'required|date',
            // 'valid_to' => 'nullable|date|after_or_equal:valid_from',
        ]);

        Tax::create([
            'name' => $validated['name'],
            'percentage' => $validated['percentage'],
            // 'valid_from' => $validated['valid_from'],
            // 'valid_to' => $validated['valid_to'],
        ]);

        return redirect()->route('tax.index')->with('success', 'Tax created successfully.');
        // return redirect('/tax')->with('success', 'Tax created successfully.');
    }

    public function edit($id)
    {
        $tax = Tax::findOrFail($id);
        return Inertia::render('Tax/Edit', compact('tax'));
    }

    public function update(Request $request, $id)
    {
        $tax = Tax::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'percentage' => 'required|integer|min:0|max:100',
            'valid_from' => 'required|date',
            'valid_to' => 'nullable|date|after_or_equal:valid_from',
        ]);

        $tax->update($validated);

        return redirect()->route('tax.index')->with('success', 'Tax updated successfully.');
    }

    public function destroy($id)
    {
        $tax = Tax::findOrFail($id);
        $tax->delete();

        return redirect()->route('tax.index')->with('success', 'Tax deleted successfully.');
    }
}
