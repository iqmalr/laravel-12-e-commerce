<?php

use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\StaffController;
use App\Http\Controllers\Web\TaxController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/staff', [StaffController::class, 'index'])->name('staff.index');
    Route::get('/staff/create', [StaffController::class, 'create'])->name('staff.create');
    Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');
    Route::delete('/staff/{id}', [StaffController::class, 'destroy'])->name('staff.destroy');
    Route::get('/staff/{product}/edit', [StaffController::class, 'edit'])->name('staff.edit');
    Route::post('/staff/{id}', [StaffController::class, 'update'])->name('staff.update');
    Route::post('/staff/{id}/restore', [StaffController::class, 'restore'])->name('staff.restore');

    Route::prefix('product')->name('product.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::post('/{id}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProductController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('tax')->name('tax.')->group(function () {
        Route::get('/', [TaxController::class, 'index'])->name('index');
        Route::get('/create', [TaxController::class, 'create'])->name('create');
        Route::post('/', [TaxController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TaxController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TaxController::class, 'update'])->name('update');
        Route::delete('/{id}', [TaxController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
