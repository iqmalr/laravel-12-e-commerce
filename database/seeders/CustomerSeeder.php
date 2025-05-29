<?php

namespace Database\Seeders;

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
        // DB::table('customers')->truncate();

        $createdBy = User::where('role_id', 1)->first()?->id ?? Str::uuid();

        $customers = [
            [
                'name' => 'John Doe',
                'username' => 'johndoe',
                'email' => 'johndoe@example.com',
                'birthdate' => '1992-03-10',
                'birthplace' => 'Surabaya',
            ],
            [
                'name' => 'Jane Smith',
                'username' => 'janesmith',
                'email' => 'janesmith@example.com',
                'birthdate' => '1989-07-21',
                'birthplace' => 'Semarang',
            ],
            [
                'name' => 'Ali Akbar',
                'username' => 'aliakbar',
                'email' => 'aliakbar@example.com',
                'birthdate' => '1995-11-05',
                'birthplace' => 'Yogyakarta',
            ],
        ];

        foreach ($customers as $cust) {
            $userId = Str::uuid();
            DB::table('users')->insert([
                'id' => $userId,
                'name' => $cust['name'],
                'username' => $cust['username'],
                'email' => $cust['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('m_customers')->insert([
                'id' => $userId,
                'birthdate' => $cust['birthdate'],
                'birthplace' => $cust['birthplace'],
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
