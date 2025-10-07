<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SesiUjian extends Model
{
    protected $fillable = [
        'ruangan_id',
        'academic_year_id',
        'semester',
        'jenis_asesmen',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function ruangan() {
        return $this->belongsTo(Ruangan::class);
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class);
    }

    public function pesertas() {
        return $this->belongsToMany(User::class, 'sesi_ujian_peserta')->withTimestamps();
    }

    public function jadwalSlots(){
        return $this->hasMany(JadwalSlot::class);
    }
}
