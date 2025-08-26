<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StaffService
{
    public function getAll()
    {
        return User::withTrashed()->where('role_id',2)->get();
    }
    public function find($id)
    {
        return User::where('role_id',2)->findOrFail($id);
    }
    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => 2,
        ]);
    }
    public function update($id, array $data)
    {
        $staff = $this->find($id);

        $staff->update([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'] ? Hash::make($data['password']) : $staff->password,
        ]);

        return $staff;
    }

    public function delete($id)
    {
        $staff = $this->find($id);
        $staff->delete();
    }
    public function restore($id)
    {
        $staff = User::withTrashed()->findOrFail($id);
        $staff->restore();
    }
}
