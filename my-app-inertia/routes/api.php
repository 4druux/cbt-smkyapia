<?php

use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\DataSiswa\AcademicYearController;
use App\Http\Controllers\Api\DataSiswa\DataSiswaController;
use App\Http\Controllers\Api\DataSiswa\JurusanController;
use App\Http\Controllers\Api\DataSiswa\KelasController;

// Rute Autentikasi
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->group(function () {
    // Jurusan
    Route::get('/jurusan', [JurusanController::class, 'getJurusans']);
    Route::post('/jurusan', [JurusanController::class, 'createJurusan']);
    Route::delete('/jurusan/{jurusan}', [JurusanController::class, 'deleteJurusan']);

    // Kelas
    Route::get('/kelas', [KelasController::class, 'getKelas']);
    Route::get('/jurusan/{jurusan}/kelas', [KelasController::class, 'getKelasByJurusan']);
    Route::get('/kelas/{kelas}', [KelasController::class, 'showKelas']);
    Route::post('/kelas', [KelasController::class, 'createKelas']);
    Route::delete('/kelas/{kelas}', [KelasController::class, 'deleteKelas']);

    // Academic Year
    Route::get('/academic-years', [AcademicYearController::class, 'getAcademicYears']);
    Route::post('/academic-years', [AcademicYearController::class, 'createAcademicYear']);
    Route::delete('/academic-years/{year}', [AcademicYearController::class, 'deleteAcademicYear']);

    // Siswa
    Route::post('/siswa', [DataSiswaController::class, 'createSiswa']);
    Route::post('/siswa/single', [DataSiswaController::class, 'storeSingleStudent']);
    Route::put('/siswa/{siswa}', [DataSiswaController::class, 'updateSiswa']);
    Route::delete('/siswa/{siswa}', [DataSiswaController::class, 'deleteSiswa']);
    Route::post('/siswa/promote', [DataSiswaController::class, 'promoteStudents']);

    Route::prefix('users')->group(function () {
        Route::get('/', [UserManagementController::class, 'index']); 
        Route::post('/{user}/approve', [UserManagementController::class, 'approve']);
        Route::put('/{user}/reset-password', [UserManagementController::class, 'resetPassword']);
        Route::delete('/{user}', [UserManagementController::class, 'destroy']);
    });
});
