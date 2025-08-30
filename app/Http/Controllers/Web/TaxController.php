<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tax\TaxRequest;
use App\Models\Tax;
use App\Services\TaxService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TaxController extends Controller
{
    protected TaxService $taxService;
    public function __construct(TaxService $taxService)
    {
        $this->taxService = $taxService;
    }

    public function index()
    {
        $tax = Tax::withTrashed()->get();
        return Inertia::render('Tax/Index', compact('tax'));
    }

    public function create()
    {
        return Inertia::render('Tax/Create');
    }

    public function store(TaxRequest $request):RedirectResponse
    {
        $this->taxService->create($request->validated());

        return redirect()->route('tax.index')->with('success', 'Tax created successfully.');
    }

    public function edit($id)
    {
        $tax = $this->taxService->find($id);

        return Inertia::render('Tax/Edit', compact('tax'));
    }

    public function update(TaxRequest $request, $id)
    {
        $this->taxService->update($id, $request->validated());

        return redirect()->route('tax.index')->with('success', 'Tax updated successfully.');
    }

    public function destroy($id)
    {
        $this->taxService->delete($id);
        return redirect()->route('tax.index')->with('success', 'Tax deleted successfully.');
    }
    public function restore($id)
    {
        $this->taxService->restore($id);
        return redirect()->route('tax.index')->with('success', 'Tax restored successfully.');
    }
}
