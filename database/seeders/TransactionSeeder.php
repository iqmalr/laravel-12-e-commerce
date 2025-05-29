<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('t_transactions')->truncate();

        $customers = DB::table('m_customers')->pluck('id')->toArray();
        $staffs = DB::table('users')->where('role_id', 2)->pluck('id')->toArray();
        $paymentMethods = DB::table('m_payment_methods')->pluck('id')->toArray();
        $statuses = DB::table('m_transaction_statuses')->pluck('id')->toArray();

        $faker = \Faker\Factory::create();

        $transactions = [];

        for ($i = 0; $i < 100; $i++) {
            $transactions[] = [
                'id' => Str::uuid(),
                'customer_id' => $faker->randomElement($customers),
                'staff_id' => $faker->randomElement($staffs),
                'transaction_time' => $faker->dateTimeBetween('-5 month', 'now'),
                'payment_method_id' => $faker->randomElement($paymentMethods),
                'transaction_status_id' => $faker->randomElement($statuses),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('t_transactions')->insert($transactions);
    }
}
