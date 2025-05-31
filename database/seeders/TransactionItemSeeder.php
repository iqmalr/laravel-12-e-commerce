<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('t_transaction_items')->truncate();

        $transactions = DB::table('t_transactions')->pluck('id')->toArray();
        $products = Product::all()->keyBy('id');

        $productTaxes = DB::table('t_product_taxes')
            ->join('m_taxes', 't_product_taxes.tax_id', '=', 'm_taxes.id')
            ->select('t_product_taxes.product_id', 'm_taxes.percentage')
            ->get()
            ->groupBy('product_id');

        $faker = \Faker\Factory::create();
        $items = [];

        foreach ($transactions as $transactionId) {
            $productSample = $products->random(rand(1, 2));

            foreach ($productSample as $product) {
                $quantity = $faker->numberBetween(1, 2);
                $unitPrice = $product->price;
                $subtotal = $unitPrice * $quantity;

                $taxPercentages = $productTaxes->get($product->id)?->pluck('percentage') ?? collect([0]);
                $totalTaxPercentage = $taxPercentages->sum();
                $taxAmount = intval(round($subtotal * ($totalTaxPercentage / 100)));

                $items[] = [
                    'id' => Str::uuid(),
                    'transaction_id' => $transactionId,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'applied_tax_percentage' => $totalTaxPercentage,
                    'tax_amount' => $taxAmount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('t_transaction_items')->insert($items);
    }
}
