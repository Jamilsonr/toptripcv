<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\VacationRequestController;
use App\Http\Controllers\Gestor\VacationApprovalController as GestorVacationApprovalController;
use App\Http\Controllers\Rh\VacationApprovalController as RhVacationApprovalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ferias', [VacationRequestController::class, 'index'])->name('vacations.index');
    Route::get('/ferias/novo', [VacationRequestController::class, 'create'])->name('vacations.create');
    Route::post('/ferias', [VacationRequestController::class, 'store'])->name('vacations.store');
    Route::post('/ferias/{vacationRequest}/cancelar', [VacationRequestController::class, 'cancel'])->name('vacations.cancel');

    Route::get('/notificacoes', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notificacoes/{notificationId}/ler', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::get('/gestor/ferias', [GestorVacationApprovalController::class, 'index'])
        ->middleware('role:gestor|rh')
        ->name('gestor.vacations.approvals');
    Route::post('/gestor/ferias/{vacationRequest}/aprovar', [GestorVacationApprovalController::class, 'approve'])
        ->middleware('role:gestor|rh')
        ->name('gestor.vacations.approve');
    Route::post('/gestor/ferias/{vacationRequest}/rejeitar', [GestorVacationApprovalController::class, 'reject'])
        ->middleware('role:gestor|rh')
        ->name('gestor.vacations.reject');

    Route::get('/rh/ferias', [RhVacationApprovalController::class, 'index'])
        ->middleware('role:rh')
        ->name('rh.vacations.approvals');
    Route::post('/rh/ferias/{vacationRequest}/aprovar', [RhVacationApprovalController::class, 'approve'])
        ->middleware('role:rh')
        ->name('rh.vacations.approve');
    Route::post('/rh/ferias/{vacationRequest}/rejeitar', [RhVacationApprovalController::class, 'reject'])
        ->middleware('role:rh')
        ->name('rh.vacations.reject');
});

Route::get('/gestor', function () {
    return Inertia::render('Gestor/Dashboard');
})->middleware(['auth', 'verified', 'role:gestor|rh'])->name('gestor.dashboard');

Route::get('/rh', function () {
    return Inertia::render('Rh/Dashboard');
})->middleware(['auth', 'verified', 'role:rh'])->name('rh.dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
