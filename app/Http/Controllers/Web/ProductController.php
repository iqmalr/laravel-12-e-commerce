<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Tax;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $product = Product::withTrashed()->get();
        return Inertia::render('Product/Index', compact('product'));
    }
    public function create()
    {
        $allTaxes = Tax::all();
        return Inertia::render('Product/Create', compact('allTaxes'));
    }

    public function store(Request $request, Cloudinary $cloudinary)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'description' => 'required|string',
            'taxes' => 'array',
            'taxes.*' => 'exists:m_taxes,id',
        ]);

        $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
            'folder' => 'laravel-sales'
        ]);

        $validated['image_url'] = $uploadResult['secure_url'];
        $validated['image_public_id'] = $uploadResult['public_id'];

        DB::transaction(function () use ($validated) {
            $product = Product::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'image_url' => $validated['image_url'],
                'image_public_id' => $validated['image_public_id'],
            ]);

            if (!empty($validated['taxes'])) {
                $product->taxes()->attach($validated['taxes']);
            }
        });

        return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan');
    }

    public function edit($id)
    {
        $product = Product::with('taxes')->findOrFail($id);
        $allTaxes = Tax::all();
        return Inertia::render('Product/Edit', [
            'product' => $product,
            'allTaxes' => $allTaxes
        ]);
    }

    public function update(Request $request, $id, Cloudinary $cloudinary)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'description' => 'required|string',
            'taxes' => 'array',
            'taxes.*' => 'exists:m_taxes,id',
            'image' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($validated, $id, $request, $cloudinary) {
            $product = Product::findOrFail($id);

            if ($request->hasFile('image')) {
                if ($product->image_public_id) {
                    $cloudinary->uploadApi()->destroy($product->image_public_id);
                }
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    ['folder' => 'laravel-pos']
                );
                $product->image_url = $uploadResult['secure_url'];
                $product->image_public_id = $uploadResult['public_id'];
            }

            $product->name = $validated['name'];
            $product->price = $validated['price'];
            $product->save();

            $product->taxes()->sync($validated['taxes'] ?? []);
        });

        return redirect()->route('product.index')->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('product.index')->with('success', 'Produk deleted successfully.');
    }
}
