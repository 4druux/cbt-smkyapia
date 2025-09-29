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
        Route::inertia('/', 'Proctor/ManajemenUjian/Sesi/IndexPage')->name('index');
        Route::inertia('/create', 'Proctor/ManajemenUjian/Sesi/CreatePage')->name('create');
        Route::inertia('/{sesiUjian}/edit', 'Proctor/ManajemenUjian/Sesi/EditPage')->name('edit');
    });

    Route::inertia('/kelola-ruangan', 'Proctor/ManajemenUjian/Ruangan/RuanganPage')->name('kelola-ruangan.index');
    Route::inertia('/kelola-mapel', 'Proctor/ManajemenUjian/Mapel/MapelPage')->name('kelola-mapel.index');
    
    Route::prefix('kelola-pengawas')->name('kelola-pengawas.')->group(function () {
        Route::inertia('/', 'Proctor/ManajemenUjian/Pengawas/SelectRole')->name('index');
        Route::inertia('/select-class', 'Proctor/ManajemenUjian/Pengawas/SelectClass')->name('class.index');
        Route::inertia('/select-year', 'Proctor/ManajemenUjian/Pengawas/SelectYear')->name('year.index');
        Route::inertia('/select-semester', 'Proctor/ManajemenUjian/Pengawas/SelectSemester')->name('semester.index');
        Route::inertia('/select-assessment', 'Proctor/ManajemenUjian/Pengawas/SelectAssessment')->name('assessment.index');
        Route::inertia('/show-assessment', 'Proctor/ManajemenUjian/Pengawas/ShowAssessment')->name('assessment.show');
    });


    Route::inertia('/kelola-ujian', 'Proctor/KelolaUjian/HomePage')->name('kelola-ujian');
    Route::inertia('/ujian-online', 'Student/UjianOnline/HomePage')->name('ujian-online');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});