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

    Route::prefix('manajemen-ruangan')->name('manajemen-ruangan.')->group(function () {
        Route::inertia('/', 'Proctor/ManajemenRuangan/SelectRole')->name('role.index');
        Route::inertia('/select-class', 'Proctor/ManajemenRuangan/SelectClass')->name('class.index');
        Route::inertia('/select-semester', 'Proctor/ManajemenRuangan/SelectSemester')->name('semester.index');
        Route::inertia('/select-assessment', 'Proctor/ManajemenRuangan/SelectAssessment')->name('assessment.index');

    });

    Route::inertia('/kelola-ujian', 'Proctor/KelolaUjian/HomePage')->name('kelola-ujian');
    Route::inertia('/ujian-online', 'Student/UjianOnline/HomePage')->name('ujian-online');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});