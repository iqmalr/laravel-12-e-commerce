<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('m_users')->truncate();
        DB::table('m_customers')->truncate();
        $superAdminId = Str::uuid();
        DB::table('m_users')->insert([
            'id' => $superAdminId,
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'superadmin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $staffId = Str::uuid();
        DB::table('m_users')->insert([
            'id' => $staffId,
            'name' => 'Staff Member',
            'username' => 'staff',
            'email' => 'staff@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $customer1Id = Str::uuid();
        DB::table('m_users')->insert([
            'id' => $customer1Id,
            'name' => 'Customer One',
            'username' => 'customer1',
            'email' => 'customer1@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $customer2Id = Str::uuid();
        DB::table('m_users')->insert([
            'id' => $customer2Id,
            'name' => 'Customer Two',
            'username' => 'customer2',
            'email' => 'customer2@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('m_customers')->insert([
            [
                'id' => Str::uuid(),
                'birthdate' => '1990-01-15',
                'birthplace' => 'Jakarta',
                'created_by' => $superAdminId,
                'updated_by' => $superAdminId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'birthdate' => '1985-05-20',
                'birthplace' => 'Bandung',
                'created_by' => $superAdminId,
                'updated_by' => $superAdminId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
