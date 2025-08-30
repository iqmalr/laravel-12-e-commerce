<?php

namespace App\Providers;

use App\Repositories\Interfaces\StaffRepositoryInterface;
use App\Repositories\Interfaces\TaxRepositoryInterface;
use App\Repositories\StaffRepository;
use App\Repositories\TaxRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            StaffRepositoryInterface::class,
            StaffRepository::class
        );
        $this->app->bind(
            TaxRepositoryInterface::class,
            TaxRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
