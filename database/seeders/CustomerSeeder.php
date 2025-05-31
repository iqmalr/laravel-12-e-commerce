<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $createdBy = User::where('role_id', 1)->inRandomOrder()->first()?->id;

        User::factory()->count(50)->create([
            'role_id' => 3,
            'password' => Hash::make('password'),
        ])->each(function ($user) use ($createdBy) {
            Customer::factory()->create([
                'id' => $user->id,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ]);
        });
    }
}
