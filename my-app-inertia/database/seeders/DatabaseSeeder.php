<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Ruangan;
use App\Models\User;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Andrew S',
            'email' => 'admin123@gmail.com',
            'password' => '12345678',
            'role' => 'superadmin'
        ]);

        DB::table('academic_years')->delete();

        for ($startYear = 2022; $startYear <= 2026; $startYear++) {
            $endYear = $startYear + 1;
            AcademicYear::create([
                'year' => $startYear . '-' . $endYear
            ]);
        }

        // Dummy sementara
        for ($i = 1; $i <= 7; $i++) {
            $name = 'Pengawas ' . $i;
            User::create([
                'name' => $name,
                'email' => Str::slug($name, '') . '@smkyapia.com',
                'password' => Hash::make('12345678'),
                'role' => 'pengawas',
                'approved_at' => now(),
            ]);
        }

        $jurusanJarkom = Jurusan::create([
            'nama_jurusan' => 'JARKOM'
        ]);

        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'X',
            'kelompok' => 'TKJ 1'
        ]);
        Kelas::create([
            'jurusan_id' => $jurusanJarkom->id,
            'nama_kelas' => 'XI',
            'kelompok' => 'TKJ 1'
        ]);

        DB::table('mata_pelajarans')->delete();
        $mapels = [
            ['kode_mapel' => 'MTK', 'nama_mapel' => 'Matematika'],
            ['kode_mapel' => 'BIN', 'nama_mapel' => 'Bahasa Indonesia'],
            ['kode_mapel' => 'BIG', 'nama_mapel' => 'Bahasa Inggris'],
            ['kode_mapel' => 'IPA', 'nama_mapel' => 'Ilmu Pengetahuan Alam'],
            ['kode_mapel' => 'IPS', 'nama_mapel' => 'Ilmu Pengetahuan Sosial'],
        ];

        foreach ($mapels as $mapel) {
            MataPelajaran::create($mapel);
        }

        DB::table('ruangans')->delete();
        $ruangans = [
            ['kode_ruangan' => 'R-101', 'nama_ruangan' => 'Ruang Teori 1', 'kapasitas' => 40],
            ['kode_ruangan' => 'R-102', 'nama_ruangan' => 'Ruang Teori 2', 'kapasitas' => 40],
            ['kode_ruangan' => 'LAB-KOM-01', 'nama_ruangan' => 'Laboratorium Komputer 1', 'kapasitas' => 30],
            ['kode_ruangan' => 'AULA', 'nama_ruangan' => 'Aula Serbaguna', 'kapasitas' => 150],
        ];

        foreach ($ruangans as $ruangan) {
            Ruangan::create($ruangan);
        }
    }
}

