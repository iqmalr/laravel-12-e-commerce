<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('m_taxes')->truncate();

        $now = Carbon::now();

        $taxes = [
            [
                'name' => 'PPN',
                'percentage' => 11,
                // 'valid_from' => Carbon::create(2024, 12, 31),

                // 'valid_to' => null,
                'created_at' => $now,
            ],
            [
                'name' => 'PPnBM',
                'percentage' => 10,
                // 'valid_from' => $now,
                // 'valid_to' => null,
                'created_at' => $now,
            ],
            [
                'name' => 'PPnBM',
                'percentage' => 20,
                // 'valid_from' => $now,
                // 'valid_to' => null,
                'created_at' => $now,
            ],
            [
                'name' => 'PPN',
                'percentage' => 10,
                // 'valid_from' => Carbon::create(2024, 1, 1),
                // 'valid_to' => Carbon::create(2024, 12, 31),
                'created_at' => Carbon::create(2024, 1, 1),
            ],
        ];

        foreach ($taxes as $tax) {
            $createdAt = $tax['created_at'];
            $name = Str::of($tax['name'])->lower()->replace([' ', '%'], '');
            $percentage = $tax['percentage'];
            $dateCode = $createdAt->format('dmy');

            $id = $name . $percentage . $dateCode;

            DB::table('m_taxes')->insert([
                'id' => $id,
                'name' => $tax['name'],
                'percentage' => $percentage,
                // 'valid_from' => $tax['valid_from'],
                // 'valid_to' => $tax['valid_to'],
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }
    }
}
