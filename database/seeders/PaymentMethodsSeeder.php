<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use App\Models\PaymentMethods;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('m_payment_methods')->truncate();
        $methods = [
            ['name' => 'Cash', 'description' => 'Pembayaran tunai'],
            ['name' => 'Credit Card', 'description' => 'Pembayaran dengan kartu kredit'],
            ['name' => 'Bank Transfer', 'description' => 'Pembayaran melalui transfer bank'],
            ['name' => 'E-Wallet', 'description' => 'Pembayaran menggunakan dompet digital'],
        ];

        foreach ($methods as $method) {
            PaymentMethod::firstOrCreate(['name' => $method['name']], $method);
        }
    }
}
