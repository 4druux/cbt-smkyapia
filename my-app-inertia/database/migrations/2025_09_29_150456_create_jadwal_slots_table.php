<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('jadwal_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_ujian_id')->constrained('sesi_ujians')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->nullable()->constrained('mata_pelajarans')->onDelete('cascade');
            $table->foreignId('pengawas_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('hari', 50);
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('jadwal_slots');
    }
};