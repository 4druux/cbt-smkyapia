<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::inertia('/', 'HomePage')->name('home');

    Route::prefix('data-siswa')->name('data-siswa.')->group(function () {
        Route::inertia('/', 'Proctor/DataSiswa/SelectClass')->name('index');
        Route::inertia('/input', 'Proctor/DataSiswa/InputData')->name('input');
        Route::inertia('/show', 'Proctor/DataSiswa/ShowClass')->name('show');
    });

    Route::prefix('manajemen-akun')->name('manajemen-akun.')->group(function () {
        Route::inertia('/', 'Proctor/ManajemenAkun/SelectAccount')->name('index');
        Route::inertia('/show', 'Proctor/ManajemenAkun/ShowAccount')->name('show');
    });

    Route::prefix('sesi-ujian')->name('sesi-ujian.')->group(function() {
        Route::inertia('/', 'Proctor/ManajemenUjian/Sesi/SesiPage')->name('index');
        Route::inertia('/create', 'Proctor/ManajemenUjian/Sesi/CreatePage')->name('create');
        Route::get('/{sesiUjian}/edit', function ($sesiUjian) {
            return Inertia::render('Proctor/ManajemenUjian/Sesi/EditPage', [
                'sesiUjian' => $sesiUjian
            ]);
        })->name('edit');
    });

    Route::inertia('/kelola-ruangan', 'Proctor/ManajemenUjian/Ruangan/RuanganPage')->name('kelola-ruangan.index');
    Route::inertia('/kelola-mapel', 'Proctor/ManajemenUjian/Mapel/MapelPage')->name('kelola-mapel.index');
    Route::inertia('/kelola-soal', 'Proctor/ManajemenUjian/Soal/SoalPage')->name('kelola-soal.index');
    Route::inertia('/kelola-pengawas', 'Proctor/ManajemenUjian/Pengawas/PengawasPage')->name('kelola-pengawas.index');

    Route::inertia('/ujian-online', 'Student/UjianOnline/HomePage')->name('ujian-online');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});