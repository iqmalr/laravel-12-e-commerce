<?php

namespace App\Jobs;

use App\Models\Product;
use Cloudinary\Api\Upload\UploadApi;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

// class UploadImageCloudinary implements ShouldQueue
// {
//     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

//     protected string $productId;
//     protected string $imagePath;

//     public $tries = 3;
//     public $maxExceptions = 3;
//     public $backoff = [10, 30, 60];

//     public function __construct(string $productId, string $imagePath)
//     {
//         $this->productId = $productId;
//         $this->imagePath = $imagePath;
//     }

//     public function handle(): void
//     {
//         try {
//             Log::info("=== MULAI UPLOAD JOB (Attempt: {$this->attempts()}) ===");
//             Log::info("Product ID: {$this->productId}");
//             Log::info("Image Path: {$this->imagePath}");

//             $product = $this->findProductWithRetry();
//             if (!$product) {
//                 Log::error("Product dengan ID {$this->productId} tidak ditemukan setelah retry");
//                 return;
//             }

//             Log::info("Product ditemukan: " . $product->name);

//             $disk = Storage::disk('private');
//             if (!$disk->exists($this->imagePath)) {
//                 Log::error("File tidak ditemukan di Storage: {$this->imagePath}");
//                 $this->updateProductStatus($product, 'failed');
//                 return;
//             }

//             $imageRealPath = $disk->path($this->imagePath);

//             if (!file_exists($imageRealPath)) {
//                 Log::warning("File tidak ditemukan secara fisik di path: {$imageRealPath}");

//                 $tempFile = $this->createTempFileFromStorage();
//                 if (!$tempFile) {
//                     $this->updateProductStatus($product, 'failed');
//                     return;
//                 }

//                 $imageRealPath = $tempFile;
//                 Log::info("Menggunakan file sementara dari Storage: {$imageRealPath}");
//             }

//             Log::info("File ditemukan, ukuran: " . filesize($imageRealPath) . " bytes");
//             Log::info("Mulai upload ke Cloudinary...");

//             $uploadApi = new UploadApi();
//             $result = $uploadApi->upload($imageRealPath, [
//                 'folder' => 'laravel-sales',
//                 'resource_type' => 'image'
//             ]);

//             if (!$result || !isset($result['secure_url']) || !isset($result['public_id'])) {
//                 throw new Exception('Invalid response from Cloudinary: ' . json_encode($result));
//             }

//             Log::info("Upload berhasil, URL: " . $result['secure_url']);

//             $this->updateProductStatus($product, 'success', [
//                 'image_url' => $result['secure_url'],
//                 'image_public_id' => $result['public_id']
//             ]);

//             if ($disk->exists($this->imagePath)) {
//                 $disk->delete($this->imagePath);
//                 Log::info("File temporary berhasil dihapus dari Storage");
//             }

//             if (isset($tempFile) && file_exists($tempFile)) {
//                 unlink($tempFile);
//                 Log::info("Temporary file berhasil dihapus dari filesystem");
//             }

//             Log::info("=== SELESAI UPLOAD JOB ===");
//         } catch (Exception $e) {
//             Log::error("=== ERROR UPLOAD JOB ===");
//             Log::error("Gagal upload gambar untuk produk {$this->productId}: " . $e->getMessage());
//             Log::error("Stack trace: " . $e->getTraceAsString());

//             $product = Product::find($this->productId);
//             if ($product) {
//                 $this->updateProductStatus($product, 'failed');
//             }

//             if ($this->attempts() >= $this->tries) {
//                 throw $e;
//             } else {
//                 Log::info("Will retry in " . $this->backoff[$this->attempts() - 1] . " seconds");
//                 throw $e;
//             }
//         }
//     }

//     private function createTempFileFromStorage(): ?string
//     {
//         try {
//             $disk = Storage::disk('private');

//             if (!$disk->exists($this->imagePath)) {
//                 Log::warning("File tidak ada saat mencoba buat file sementara");
//                 return null;
//             }

//             $tempFile = tempnam(sys_get_temp_dir(), 'img_');
//             file_put_contents($tempFile, $disk->get($this->imagePath));
//             return $tempFile;
//         } catch (Exception $e) {
//             Log::error("Gagal membuat temporary file: " . $e->getMessage());
//             return null;
//         }
//     }

//     private function findProductWithRetry(int $retries = 3, int $delayMs = 200): ?Product
//     {
//         for ($i = 0; $i < $retries; $i++) {
//             $product = Product::find($this->productId);
//             if ($product) {
//                 return $product;
//             }
//             usleep($delayMs * 1000);
//         }
//         return null;
//     }

//     private function updateProductStatus(Product $product, string $status, array $data = []): void
//     {
//         $product->status = $status;
//         $product->image_url = $data['image_url'] ?? null;
//         $product->image_public_id = $data['image_public_id'] ?? null;
//         $product->save();
//         Log::info("Product status updated to: {$status}");
//     }
// }

// class UploadImageCloudinary implements ShouldQueue
// {
//     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

//     protected string $productId;
//     protected string $imagePath;

//     public $tries = 3;
//     public $backoff = [10, 30, 60];

//     public function __construct(string $productId, string $imagePath)
//     {
//         $this->productId = $productId;
//         $this->imagePath = $imagePath;
//     }

//     public function handle(): void
//     {
//         $product = Product::find($this->productId);
//         if (!$product) {
//             throw new Exception("Product with ID {$this->productId} not found");
//         }

//         $disk = Storage::disk('private');
//         if (!$disk->exists($this->imagePath)) {
//             $this->updateProductStatus($product, 'failed');
//             throw new Exception("Image file not found: {$this->imagePath}");
//         }

//         try {
//             $uploadApi = new UploadApi();
//             $result = $uploadApi->upload($disk->get($this->imagePath), [
//                 'folder' => 'laravel-sales',
//                 'resource_type' => 'image'
//             ]);

//             if (!$result || !isset($result['secure_url']) || !isset($result['public_id'])) {
//                 throw new Exception('Invalid response from Cloudinary');
//             }

//             $this->updateProductStatus($product, 'success', [
//                 'image_url' => $result['secure_url'],
//                 'image_public_id' => $result['public_id']
//             ]);

//             $disk->delete($this->imagePath);
//         } catch (Exception $e) {
//             $this->updateProductStatus($product, 'failed');
//             throw $e;
//         }
//     }

//     private function updateProductStatus(Product $product, string $status, array $data = []): void
//     {
//         $product->update([
//             'status' => $status,
//             'image_url' => $data['image_url'] ?? null,
//             'image_public_id' => $data['image_public_id'] ?? null,
//         ]);
//     }
// }

class UploadImageCloudinary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $productId;
    protected string $imagePath;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    public function __construct(string $productId, string $imagePath)
    {
        $this->productId = $productId;
        $this->imagePath = $imagePath;
    }

    public function handle(): void
    {
        $product = Product::find($this->productId);
        if (!$product) {
            throw new Exception("Product with ID {$this->productId} not found");
        }

        $disk = Storage::disk('private');
        if (!$disk->exists($this->imagePath)) {
            $this->updateProductStatus($product, 'failed');
            throw new Exception("Image file not found: {$this->imagePath}");
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'img_');
        file_put_contents($tempFile, $disk->get($this->imagePath));

        try {
            $uploadApi = new UploadApi();
            $result = $uploadApi->upload($tempFile, [
                'folder' => 'laravel-sales',
                'resource_type' => 'image'
            ]);

            if (!$result || !isset($result['secure_url']) || !isset($result['public_id'])) {
                throw new Exception('Invalid response from Cloudinary');
            }

            $this->updateProductStatus($product, 'success', [
                'image_url' => $result['secure_url'],
                'image_public_id' => $result['public_id']
            ]);

            $disk->delete($this->imagePath);
        } catch (Exception $e) {
            $this->updateProductStatus($product, 'failed');
            throw $e;
        } finally {
            if (file_exists($tempFile)) {
                unlink($tempFile);
            }
        }
    }

    private function updateProductStatus(Product $product, string $status, array $data = []): void
    {
        $product->update([
            'status' => $status,
            'image_url' => $data['image_url'] ?? null,
            'image_public_id' => $data['image_public_id'] ?? null,
        ]);
    }
}
