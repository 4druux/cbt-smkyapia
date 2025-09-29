<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ruangan extends Model
{
    protected $fillable = ['nama_ruangan', 'kode_ruangan', 'kapasitas'];

    public function sesiUjians() {
        return $this->hasMany(SesiUjian::class);
    }
}
