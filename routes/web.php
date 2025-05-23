<?php

use App\Http\Controllers\Web\StaffController;
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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
