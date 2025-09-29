<?php

use App\Http\Controllers\Api\ManajemenRuangan\MataPelajaranController;
use App\Http\Controllers\Api\ManajemenRuangan\RuanganController;
use App\Http\Controllers\Api\ManajemenRuangan\SesiUjianController;
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
    Route::controller(JurusanController::class)->prefix('jurusan')->group(function () {
        Route::get('/', 'getJurusans');
        Route::post('/', 'createJurusan');
        Route::delete('/{jurusan}', 'deleteJurusan');
    });

    // Kelas
    Route::controller(KelasController::class)->group(function () {
        Route::prefix('kelas')->group(function () {
            Route::get('/', 'getKelas');
            Route::get('/{kelas}', 'showKelas');
            Route::post('/', 'createKelas');
            Route::delete('/{kelas}', 'deleteKelas');
        });

        Route::get('/jurusan/{jurusan}/kelas', 'getKelasByJurusan');
    });

    // Academic Year
    Route::controller(AcademicYearController::class)->prefix('academic-years')->group(function () {
        Route::get('/', 'getAcademicYears');
        Route::get('/with-classes', 'getAcademicYearsWithClasses');
        Route::post('/', 'createAcademicYear');
        Route::delete('/{year}', 'deleteAcademicYear');
    });

    // Siswa
    Route::controller(DataSiswaController::class)->prefix('siswa')->group(function () {
        Route::post('/', 'createSiswa');
        Route::post('/single', 'createSingleSiswa');
        Route::put('/{siswa}', 'updateSiswa');
        Route::delete('/{siswa}', 'deleteSiswa');
        Route::post('/promote', 'promoteStudents');
    });

    // Manajemen Akun
    Route::controller(UserManagementController::class)->prefix('users')->group(function () {
        Route::get('/', 'index');
        Route::post('/{user}/approve', 'approve');
        Route::put('/{user}/reset-password', 'resetPassword');
        Route::delete('/{user}', 'destroy');
    });

    // Manajemen Ruangan
    Route::apiResource('ruangan', RuanganController::class);
    Route::apiResource('mata-pelajaran', MataPelajaranController::class);
    Route::apiResource('sesi-ujian', SesiUjianController::class); 
});
