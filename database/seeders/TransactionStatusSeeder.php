<?php

namespace Database\Seeders;

use App\Models\TransactionStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('m_transaction_statuses')->truncate();
        $statuses = [
            ['name' => 'Pending', 'description' => 'Menunggu konfirmasi pembayaran'],
            ['name' => 'Paid', 'description' => 'Pembayaran berhasil'],
            ['name' => 'Failed', 'description' => 'Pembayaran gagal'],
            ['name' => 'Cancelled', 'description' => 'Transaksi dibatalkan'],
        ];

        foreach ($statuses as $status) {
            TransactionStatus::firstOrCreate(['name' => $status['name']], $status);
        }
    }
}
