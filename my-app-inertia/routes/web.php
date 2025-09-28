<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::inertia('/', 'HomePage')->name('home');

    Route::prefix('data-siswa')->name('data-siswa.')->group(function () {
        Route::inertia('/', 'Proctor/DataSiswa/AllClass')->name('index');
        Route::inertia('/input', 'Proctor/DataSiswa/InputData')->name('input');
        Route::inertia('/show', 'Proctor/DataSiswa/ShowClass')->name('show');
    });

    Route::prefix('manajemen-akun')->name('manajemen-akun.')->group(function () {
    Route::inertia('/', 'Proctor/ManajemenAkun/AllAccount')->name('index');
    Route::inertia('/show', 'Proctor/ManajemenAkun/ShowAccount')->name('show');
    });
    Route::inertia('/manajemen-ruangan', 'Proctor/ManajemenRuangan/HomePage')->name('manajemen-ruangan');
    Route::inertia('/kelola-ujian', 'Proctor/KelolaUjian/HomePage')->name('kelola-ujian');
    Route::inertia('/ujian-online', 'Student/UjianOnline/HomePage')->name('ujian-online');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});