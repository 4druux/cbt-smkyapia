<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sesi_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruangan_id')->constrained('ruangans')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->enum('semester', ['ganjil', 'genap']);
            $table->enum('jenis_asesmen', ['asts', 'asas']);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sesi_ujians');
    }
};