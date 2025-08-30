<?php
namespace App\Repositories;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

interface StaffRepositoryInterface
{
    public function getAll(): Collection;
    public function getAllPaginated(array $filters = []): LengthAwarePaginator;
    public function find(string $id): User;
    public function findWithTrashed(string $id): Collection|Model|SoftDeletes;
    public function create(array $data): User;
    public function update(string $id, array $data): User;
    public function delete(string $id): bool;
    public function restore(string $id): bool;
    public function forceDelete(string $id): bool;
    public function search(array $criteria): Collection;
}
