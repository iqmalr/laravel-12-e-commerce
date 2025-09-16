<?php
//
////test('example', function () {
////    expect(true)->toBeTrue();
////});
//namespace Tests\Unit\Web\Repository;
//
//use App\Models\Tax;
//use App\Repositories\TaxRepository;
//use Illuminate\Database\Eloquent\Collection;
//use Mockery;
//use Tests\TestCase;
//
//class TaxRepositoryTest extends TestCase
//{
//    protected TaxRepository $taxRepository;
//    protected function setUp(): void
//    {
//        parent::setUp();
//        $this->taxRepository = new TaxRepository();
//    }
//    protected function should_return_all_taxes()
//    {
//        $mock = Mockery::mock('alias:App\Models\Tax');
//        $mock->shouldReceive('withTrashed->orderBy->get')
//            ->once()
//            ->andReturn(new Collection());
//
//        $this->taxRepository->getAll();
//    }
//}

use App\Repositories\TaxRepository;
use Illuminate\Database\Eloquent\Collection;

beforeEach(function () {
    $this->taxRepository = new TaxRepository();
});

it('should return all taxes', function () {
    $mock = Mockery::mock('alias:App\Models\Tax');
    $mock->shouldReceive('withTrashed->orderBy->get')
        ->once()
        ->andReturn(new Collection());

    $this->taxRepository->getAll();
});

afterEach(function () {
    Mockery::close();
});
