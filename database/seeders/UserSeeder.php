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
        DB::table('users')->truncate();
        DB::table('m_customers')->truncate();
        $superAdminId = Str::uuid();
        DB::table('users')->insert([
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
        DB::table('users')->insert([
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
        $staffId2 = Str::uuid();
        DB::table('users')->insert([
            'id' => $staffId2,
            'name' => 'Staff Member 2',
            'username' => 'staff2',
            'email' => 'staff2@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
