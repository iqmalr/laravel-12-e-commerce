<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductTaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('t_product_taxes')->truncate();

        $now = Carbon::now();

        $ppn11 = DB::table('m_taxes')->where('name', 'PPN')->where('percentage', 11)->first();
        $ppn10 = DB::table('m_taxes')->where('name', 'PPN')->where('percentage', 10)->first();

        $ppnbm10 = DB::table('m_taxes')->where('name', 'PPnBM')->where('percentage', 10)->first();
        $ppnbm20 = DB::table('m_taxes')->where('name', 'PPnBM')->where('percentage', 20)->first();

        if (!$ppn11 || !$ppn10 || !$ppnbm10 || !$ppnbm20) {
            throw new \Exception('Pastikan semua data tax tersedia di tabel taxes');
        }

        $taxData = [];

        $regularProducts = Product::where('name', 'not like', '%Premium%')->get();
        foreach ($regularProducts as $product) {
            $taxData[] = [
                'product_id' => $product->id,
                'tax_id' => $ppn11->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $premiumProducts = Product::where('name', 'like', '%Premium%')->get();
        foreach ($premiumProducts as $product) {
            $ppnbm = fake()->randomElement([$ppnbm10, $ppnbm20]);

            $taxData[] = [
                'product_id' => $product->id,
                'tax_id' => $ppn11->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $taxData[] = [
                'product_id' => $product->id,
                'tax_id' => $ppnbm->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('t_product_taxes')->insert($taxData);
    }
}
