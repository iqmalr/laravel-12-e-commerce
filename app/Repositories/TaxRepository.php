<?php

namespace App\Repositories;

use App\Models\Tax;
use App\Repositories\Interfaces\TaxRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaxRepository implements TaxRepositoryInterface
{
    public function getAll():Collection
    {
        return Tax::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Tax
    {
        return Tax::create($data);
    }

    public function find(string $id): Tax
    {
        return Tax::findOrFail($id);
    }

    public function findWithTrashed(string $id): Collection|Model|SoftDeletes
    {
        return Tax::withTrashed()->findOrFail($id);
    }
    public function update(string $id, array $data): Tax
    {
        $tax = $this->find($id);
        $tax->update($data);
        return $tax->refresh();
    }
    public function delete(string $id): bool
    {
        $tax = $this->find($id);
        return $tax->delete();
    }
    public function restore(string $id): bool
    {
        $tax = $this->findWithTrashed($id);
        return $tax->restore();
    }
    public function forceDelete(string $id): bool
    {
        $tax = $this->findWithTrashed($id);
        return $tax->forceDelete();
    }
}
