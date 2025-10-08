<?php

namespace App\Http\Controllers\Api\ManajemenUjian;

use App\Http\Controllers\Controller;
use App\Models\Ruangan;
use App\Models\SesiUjian;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SesiUjianController extends Controller
{
    public function index()
    {
        $sesiUjians = SesiUjian::with([
            'ruangan',
            'academicYear',
            'pesertas',
            'jadwalSlots.mataPelajaran',
            'jadwalSlots.pengawas',
            'jadwalSlots.kelas'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($sesiUjians);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:ganjil,genap',
            'jenis_asesmen' => 'required|in:asts,asas',
            'tanggal_mulai' => [
                'required',
                'date',
                function ( $value, $fail) use ($request) {
                    $ruanganId = $request->input('ruangan_id');
                    $tanggalMulai = $value;
                    $tanggalSelesai = $request->input('tanggal_selesai');

                    if (!$ruanganId || !$tanggalMulai || !$tanggalSelesai) {
                        return;
                    }

                    $konflik = SesiUjian::where('ruangan_id', $ruanganId)
                    ->where(function ($query) use ($tanggalMulai, $tanggalSelesai) {
                        $query->where('tanggal_mulai', '<=', $tanggalSelesai)
                            ->where('tanggal_selesai', '>=', $tanggalMulai);
                        });

                    if ($request->route('sesi_ujian')) {
                        $konflik->where('id', '!=', $request->route('sesi_ujian')->id);
                    }

                    if ($konflik->exists()) {
                        $fail('Ruangan ini sudah terjadwal pada rentang tanggal tersebut.');
                    }
                },
            ],
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'peserta_ids' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    $ruanganId = $request->input('ruangan_id');
                    if (!$ruanganId) {
                        return;
                    }

                    $ruangan = Ruangan::find($ruanganId);
                    if (!$ruangan || $ruangan->kapasitas <= 0) {
                        return;
                    }

                    $jumlahPeserta = count($value);
                    if ($jumlahPeserta > $ruangan->kapasitas) {
                        $fail("Jumlah peserta melebihi kapasitas ruangan.");
                    }
                },
            ],
            'peserta_ids.*' => 'exists:siswas,id',
            'jadwal_slots' => 'present|array',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.kelas_id' => ['required', 'exists:kelas,id'],
            'jadwal_slots.*.mata_pelajaran_id' => ['required'],
            'jadwal_slots.*.pengawas_id' => [
                'required_unless:jadwal_slots.*.mata_pelajaran_id,istirahat',
                'nullable',
                'exists:users,id'
            ],
        ]);

        $sesiUjian = DB::transaction(function () use ($validated) {
            $sesiData = Arr::except($validated, ['peserta_ids', 'jadwal_slots']);
            $newSesiUjian = SesiUjian::create($sesiData);

            $sequenceCounters = [];
            $userIdsToSync = [];
            foreach ($validated['peserta_ids'] as $siswaId) {
                $siswa = Siswa::with('kelas.jurusan')->find($siswaId);
                if (!$siswa) continue;

                if (is_null($siswa->user_id)) {

                    $kelas = $siswa->kelas;
                    $jurusan = $kelas->jurusan;
                    $classIdentifier = preg_replace('/\s+/', '', $kelas->nama_kelas) . $jurusan->kode_jurusan . $kelas->kelompok;

                    if (!isset($sequenceCounters[$classIdentifier])) {
                        $sequenceCounters[$classIdentifier] = 1;
                    } else {
                        $sequenceCounters[$classIdentifier]++;
                    }
                    $sequenceNumber = $sequenceCounters[$classIdentifier];
                    $formattedSequence = str_pad($sequenceNumber, 2, '0', STR_PAD_LEFT);
                    $assessmentType = strtoupper($validated['jenis_asesmen']);
                    $noPeserta = "{$classIdentifier}.{$assessmentType}.{$formattedSequence}";
                    $newUser = User::create([
                        'name' => $siswa->nama,
                        'email' => $siswa->nis,
                        'no_peserta' => $noPeserta,
                        'password' => Hash::make($noPeserta),
                        'role' => 'siswa',
                        'approved_at' => now(),
                    ]);
                    $siswa->user_id = $newUser->id;
                    $siswa->save();
                    $userIdsToSync[] = $newUser->id;
                } else {
                    $userIdsToSync[] = $siswa->user_id;
                }
            }
            $newSesiUjian->pesertas()->sync($userIdsToSync);

            if (!empty($validated['jadwal_slots'])) {
                foreach ($validated['jadwal_slots'] as $slotData) {
                    if (isset($slotData['mata_pelajaran_id']) && $slotData['mata_pelajaran_id'] === 'istirahat') {
                        $slotData['mata_pelajaran_id'] = null;
                        $slotData['pengawas_id'] = null;
                    }
                    $newSesiUjian->jadwalSlots()->create($slotData);
                }
            }
            return $newSesiUjian;
        });

        $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas', 'jadwalSlots.kelas']);

        return response()->json([
            'message' => 'Sesi ujian berhasil dibuat.',
            'data' => $sesiUjian
        ], 201);
    }

    public function show(SesiUjian $sesiUjian)
    {
        $sesiUjian->load(['ruangan', 'academicYear', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas', 'jadwalSlots.kelas']);
        $pesertaUsers = $sesiUjian->pesertas()->get();

        $selectedSiswaIds = $pesertaUsers->map(function ($user) {
            $siswa = Siswa::where('user_id', $user->id)
                      ->orderBy('academic_year_id', 'desc')
                      ->first();
            return $siswa ? $siswa->id : null;
        })->filter();

        $sesiUjian->selected_siswa_ids = $selectedSiswaIds;
        return response()->json($sesiUjian);
    }

    public function update(Request $request, SesiUjian $sesiUjian)
    {
        $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:ganjil,genap',
            'jenis_asesmen' => 'required|in:asts,asas',
            'tanggal_mulai' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request, $sesiUjian) { 
                    $ruanganId = $request->input('ruangan_id');
                    $tanggalMulai = $value;
                    $tanggalSelesai = $request->input('tanggal_selesai');

                    if (!$ruanganId || !$tanggalMulai || !$tanggalSelesai) {
                        return;
                    }

                    $konflik = SesiUjian::where('ruangan_id', $ruanganId)
                    ->where('id', '!=', $sesiUjian->id)
                    ->where(function ($query) use ($tanggalMulai, $tanggalSelesai) {
                            $query->where('tanggal_mulai', '<=', $tanggalSelesai)
                            ->where('tanggal_selesai', '>=', $tanggalMulai);
                        });

                    if ($konflik->exists()) {
                        $fail('Ruangan ini sudah terjadwal pada rentang tanggal tersebut.');
                    }
                },
            ],
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'peserta_ids' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    $ruanganId = $request->input('ruangan_id');
                    if (!$ruanganId) {
                        return;
                    }

                    $ruangan = Ruangan::find($ruanganId);
                    if (!$ruangan || $ruangan->kapasitas <= 0) {
                        return;
                    }
                    
                    $jumlahPeserta = count($value);
                    if ($jumlahPeserta > $ruangan->kapasitas) {
                        $fail("Jumlah peserta melebihi kapasitas ruangan.");
                    }
                },
            ],
            'peserta_ids.*' => 'exists:siswas,id',
            'jadwal_slots' => 'present|array',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.kelas_id' => ['required', 'exists:kelas,id'],
            'jadwal_slots.*.mata_pelajaran_id' => ['required'],
            'jadwal_slots.*.pengawas_id' => [
                'required_unless:jadwal_slots.*.mata_pelajaran_id,istirahat',
                'nullable',
                'exists:users,id'
            ],
        ]);

        DB::transaction(function () use ($validated, $sesiUjian) {
            $sesiData = Arr::except($validated, ['peserta_ids', 'jadwal_slots']);
            $sesiUjian->update($sesiData);

            $currentUserIds = $sesiUjian->pesertas()->pluck('users.id');

            $sequenceCounters = [];
            $finalUserIds = [];
            foreach ($validated['peserta_ids'] as $siswaId) {
                $siswa = Siswa::with('kelas.jurusan')->find($siswaId);
                if (!$siswa) continue;

                if (is_null($siswa->user_id)) {
                    $kelas = $siswa->kelas;
                    $jurusan = $kelas->jurusan;
                    $classIdentifier = preg_replace('/\s+/', '', $kelas->nama_kelas) . $jurusan->kode_jurusan . $kelas->kelompok;

                    if (!isset($sequenceCounters[$classIdentifier])) {
                        $sequenceCounters[$classIdentifier] = 1;
                    } else {
                        $sequenceCounters[$classIdentifier]++;
                    }

                    $sequenceNumber = $sequenceCounters[$classIdentifier];
                    $formattedSequence = str_pad($sequenceNumber, 2, '0', STR_PAD_LEFT);
                    $assessmentType = strtoupper($validated['jenis_asesmen']);
                    $noPeserta = "{$classIdentifier}.{$assessmentType}.{$formattedSequence}";

                    $newUser = User::create([
                        'name' => $siswa->nama,
                        'email' => $siswa->nis,
                        'no_peserta' => $noPeserta,
                        'password' => Hash::make($noPeserta),
                        'role' => 'siswa',
                        'approved_at' => now(),
                    ]);

                    $siswa->user_id = $newUser->id;
                    $siswa->save();
                    $finalUserIds[] = $newUser->id;
                } else {
                    $finalUserIds[] = $siswa->user_id;
                }
            }

            $userIdsToDelete = $currentUserIds->diff($finalUserIds);

            if ($userIdsToDelete->isNotEmpty()) {
                Siswa::whereIn('user_id', $userIdsToDelete)->update(['user_id' => null]);
                User::whereIn('id', $userIdsToDelete)->delete();
            }

            $sesiUjian->pesertas()->sync($finalUserIds);

            $sesiUjian->jadwalSlots()->delete();
            if (!empty($validated['jadwal_slots'])) {
                foreach ($validated['jadwal_slots'] as $slotData) {
                    if (isset($slotData['mata_pelajaran_id']) && $slotData['mata_pelajaran_id'] === 'istirahat') {
                        $slotData['mata_pelajaran_id'] = null;
                        $slotData['pengawas_id'] = null;
                    }
                    $sesiUjian->jadwalSlots()->create($slotData);
                }
            }
        });

        return response()->json([
            'message' => 'Sesi ujian berhasil diperbarui.',
            'data' => $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas', 'jadwalSlots.kelas'])
        ]);
    }

    public function destroy(SesiUjian $sesiUjian)
    {
        DB::transaction(function () use ($sesiUjian) {
            $pesertaUsers = $sesiUjian->pesertas;

            foreach ($pesertaUsers as $user) {
                if ($user->sesiUjians()->count() === 1) {
                    Siswa::where('user_id', $user->id)->update(['user_id' => null]);
                    $user->delete();
                }
            }
            $sesiUjian->delete();
        });

        return response()->json(['message' => 'Sesi ujian berhasil dihapus.']);
    }
}