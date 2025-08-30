<?php

namespace App\Repositories\Interfaces;
use App\Models\Tax;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

interface TaxRepositoryInterface
{
    public function getAll():Collection;
    public function create(array $data):Tax;
    public function find(string $id):Tax;
    public function findWithTrashed(string $id):Collection|Model|SoftDeletes;
    public function update(string $id, array $data):Tax;
    public function delete(string $id):bool;
    public function restore(string $id):bool;
    public function forceDelete(string $id):bool;
}
