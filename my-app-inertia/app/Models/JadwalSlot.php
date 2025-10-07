<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalSlot extends Model
{
    use HasFactory;
    protected $fillable = [
        'sesi_ujian_id',
        'mata_pelajaran_id',
        'pengawas_id',
        'hari',
        'waktu_mulai',
        'waktu_selesai',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime:H:i',
        'waktu_selesai' => 'datetime:H:i',
    ];

    public function sesiUjian() {
        return $this->belongsTo(SesiUjian::class);
    }

    public function mataPelajaran() {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function pengawas() {
        return $this->belongsTo(User::class, 'pengawas_id');
    }
}