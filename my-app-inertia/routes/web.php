<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/login', function () { return Inertia::render('Auth/LoginPage'); })->name('login');
Route::get('/register', function () { return Inertia::render('Auth/RegisterPage'); })->name('register');


Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::get('/', function () { return Inertia::render('Proctor/Beranda/HomePage'); })->name('home');
    Route::get('/data-siswa', function () { return Inertia::render('Proctor/DataSiswa/AllClass'); })->name('data-siswa');
    Route::get('/manajemen-ruangan', function () { return Inertia::render('Proctor/ManajemenRuangan/HomePage'); })->name('manajemen-ruangan');
    Route::get('/manajemen-akun', function () { return Inertia::render('Proctor/ManajemenAkun/HomePage'); })->name('manajemen-akun');
    Route::get('/kelola-ujian', function () { return Inertia::render('Proctor/KelolaUjian/HomePage'); })->name('kelola-ujian');
    Route::get('/ujian-online', function () { return Inertia::render('Student/UjianOnline/HomePage'); })->name('ujian-online');
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});
