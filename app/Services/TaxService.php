<?php
namespace App\Services;

use App\Models\Tax;
use App\Repositories\Interfaces\TaxRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaxService implements TaxRepositoryInterface
{
    public function __construct(protected TaxRepositoryInterface $taxRepository)
    {
    }

    public function create(array $data): Tax
    {
        return $this->taxRepository->create($data);
    }

    public function getAll(): Collection
    {
        return $this->taxRepository->getAll();
    }

    public function find(string $id): Tax
    {
        return $this->taxRepository->find($id);
    }

    public function findWithTrashed(string $id): Collection|Model|SoftDeletes
    {
        return $this->taxRepository->findWithTrashed($id);
    }

    public function update(string $id, array $data): Tax
    {
        return $this->taxRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->taxRepository->delete($id);
    }

    public function restore(string $id): bool
    {
        return $this->taxRepository->restore($id);
    }

    public function forceDelete(string $id): bool
    {
        return $this->taxRepository->forceDelete($id);
    }
}
