<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Jobs\UploadImageCloudinary;
use App\Models\Product;
use App\Models\Tax;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    // public function store(Request $request)
    // // public function store(Request $request, Cloudinary $cloudinary)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'price' => 'required|integer',
    //         'description' => 'required|string',
    //         'taxes' => 'array',
    //         'taxes.*' => 'exists:m_taxes,id',
    //         'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    //     ]);
    //     // $imagePath = $request->file('image')->getRealPath();
    //     // $productId = (string) Str::uuid();
    //     $storedPath = $request->file('image')->store('tmp-uploads');
    //     Log::info("=== CONTROLLER DEBUG ===");
    //     // Log::info("Generated Product ID: {$productId}");
    //     Log::info("Stored Path: {$storedPath}");

    //     try {
    //         DB::transaction(function () use ($validated, $productId) {
    //             // DB::transaction(function () use ($validated, $productId) {
    //             $product = Product::create([
    //                 // 'id' => $productId,
    //                 'name' => $validated['name'],
    //                 'price' => $validated['price'],
    //                 'description' => $validated['description'],
    //                 'image_url' => null,
    //                 'image_public_id' => null,
    //                 'status' => 'pending',
    //             ]);
    //             if (!empty($validated['taxes'])) {
    //                 // $product = Product::find($productId);
    //                 $product->taxes()->attach($validated['taxes']);
    //             }
    //         });
    //         // $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
    //         //     'folder' => 'laravel-sales'
    //         // ]);
    //         // $validated['image_url'] = $uploadResult['secure_url'];
    //         // $validated['image_public_id'] = $uploadResult['public_id'];
    //         // DB::transaction(function () use ($validated) {
    //         //     $product = Product::create([
    //         //         'name' => $validated['name'],
    //         //         'price' => $validated['price'],
    //         //         'description' => $validated['description'],
    //         //         'image_url' => $validated['image_url'],
    //         //         'image_public_id' => $validated['image_public_id'],
    //         //     ]);
    //         //     if (!empty($validated['taxes'])) {
    //         //         $product->taxes()->attach($validated['taxes']);
    //         //     }
    //         // });
    //         // $productId = (string) Str::uuid();
    //         $productId = $product->id;

    //         $savedProduct = Product::find($productId);
    //         if (!$savedProduct) {
    //             Log::error("Product tidak ditemukan setelah disimpan: {$productId}");
    //             throw new Exception("Gagal menyimpan product");
    //         }

    //         Log::info("Product confirmed saved, dispatching job...");
    //         // UploadImageCloudinary::dispatch($productId, $storedPath);
    //         UploadImageCloudinary::dispatch($productId, $storedPath)->delay(now()->addSeconds(2));
    //         // return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan');
    //     } catch (Exception $e) {
    //         Log::error("Error in store method: " . $e->getMessage());

    //         // Hapus file jika ada error
    //         if (Storage::exists($storedPath)) {
    //             Storage::delete($storedPath);
    //         }

    //         return redirect()->back()->withErrors(['error' => 'Gagal menyimpan produk: ' . $e->getMessage()]);
    //     }
    // }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'price' => 'required|integer',
    //         'description' => 'required|string',
    //         'taxes' => 'array',
    //         'taxes.*' => 'exists:m_taxes,id',
    //         'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    //     ]);

    //     // Simpan file terlebih dahulu
    //     $storedPath = $request->file('image')->store('tmp-uploads');
    //     Log::info("=== CONTROLLER DEBUG ===");
    //     Log::info("Stored Path: {$storedPath}");

    //     try {
    //         $product = null;

    //         DB::transaction(function () use ($validated, &$product) {
    //             $product = Product::create([
    //                 'name' => $validated['name'],
    //                 'price' => $validated['price'],
    //                 'description' => $validated['description'],
    //                 'image_url' => null,
    //                 'image_public_id' => null,
    //                 'status' => 'pending',
    //             ]);

    //             Log::info("Generated Product ID by Laravel: {$product->id}");

    //             if (!empty($validated['taxes'])) {
    //                 $product->taxes()->attach($validated['taxes']);
    //             }
    //         });

    //         $productId = $product->id;

    //         // Pastikan product benar-benar tersimpan
    //         $savedProduct = Product::find($productId);
    //         if (!$savedProduct) {
    //             Log::error("Product tidak ditemukan setelah disimpan: {$productId}");
    //             throw new Exception("Gagal menyimpan product");
    //         }

    //         Log::info("Product confirmed saved with ID: {$productId}");
    //         Log::info("Dispatching job with Product ID: {$productId} and Path: {$storedPath}");
    //         if (!Storage::exists($storedPath)) {
    //             Log::error("File belum tersedia saat dispatch: {$storedPath}");
    //             // bisa retry, delay, atau simpan sebagai pending
    //             return back()->withErrors('File belum siap, silakan coba lagi.');
    //         }
    //         // Dispatch job dengan delay untuk menghindari race condition
    //         UploadImageCloudinary::dispatch($productId, $storedPath)->delay(now()->addSeconds(5));

    //         return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan');
    //     } catch (Exception $e) {
    //         Log::error("Error in store method: " . $e->getMessage());
    //         Log::error("Stack trace: " . $e->getTraceAsString());

    //         // Hapus file jika ada error
    //         if (Storage::exists($storedPath)) {
    //             Storage::delete($storedPath);
    //             Log::info("Temporary file deleted due to error");
    //         }

    //         return redirect()->back()
    //             ->withInput()
    //             ->withErrors(['error' => 'Gagal menyimpan produk: ' . $e->getMessage()]);
    //     }
    // }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'description' => 'required|string',
            'taxes' => 'array',
            'taxes.*' => 'exists:m_taxes,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $storedPath = $request->file('image')->store('tmp-uploads', 'private');

        try {
            $product = DB::transaction(function () use ($validated) {
                $product = Product::create([
                    'name' => $validated['name'],
                    'price' => $validated['price'],
                    'description' => $validated['description'],
                    'status' => 'pending',
                ]);

                if (!empty($validated['taxes'])) {
                    $product->taxes()->attach($validated['taxes']);
                }

                return $product;
            });

            UploadImageCloudinary::dispatch($product->id, $storedPath);

            return redirect()->route('product.index')
                ->with('success', 'Produk berhasil ditambahkan dan sedang diproses');
        } catch (Exception $e) {
            Storage::disk('private')->delete($storedPath);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menyimpan produk']);
        }
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
