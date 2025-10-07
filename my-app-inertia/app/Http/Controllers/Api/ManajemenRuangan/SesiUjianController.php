<?php

namespace App\Http\Controllers\Api\ManajemenRuangan;

use App\Http\Controllers\Controller;
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
            'jadwalSlots.pengawas'
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
                function ($attribute, $value, $fail) use ($request) {
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
            'peserta_ids' => 'required|array|min:1',
            'peserta_ids.*' => 'exists:siswas,id',
            'jadwal_slots' => 'present|array',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.mata_pelajaran_id' => ['nullable'],
            'jadwal_slots.*.pengawas_id' => ['nullable', 'exists:users,id'],
        ]);

        $sesiUjian = DB::transaction(function () use ($validated) {
            $sesiData = Arr::except($validated, ['peserta_ids', 'jadwal_slots']);
            $newSesiUjian = SesiUjian::create($sesiData);

            $userIdsToSync = [];
            foreach ($validated['peserta_ids'] as $siswaId) {
                $siswa = Siswa::find($siswaId);
                if (!$siswa) continue;

                if (is_null($siswa->user_id)) {
                    $newUser = User::create([
                        'name' => $siswa->nama,
                        'email' => $siswa->nis,
                        'nis' => $siswa->nis,
                        'password' => Hash::make($siswa->nis),
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

        $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas']);

        return response()->json([
            'message' => 'Sesi ujian berhasil dibuat.',
            'data' => $sesiUjian
        ], 201);
    }

    public function show(SesiUjian $sesiUjian)
    {
        $sesiUjian->load(['ruangan', 'academicYear', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas']);
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
                function ($attribute, $value, $fail) use ($request) {
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
            'peserta_ids' => 'required|array|min:1',
            'peserta_ids.*' => 'exists:siswas,id',
            'jadwal_slots' => 'present|array',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.mata_pelajaran_id' => ['nullable'],
            'jadwal_slots.*.pengawas_id' => ['nullable', 'exists:users,id'],
        ]);

        DB::transaction(function () use ($validated, $sesiUjian) {
            $sesiData = Arr::except($validated, ['peserta_ids', 'jadwal_slots']);
            $sesiUjian->update($sesiData);

            $userIdsToSync = [];
            foreach ($validated['peserta_ids'] as $siswaId) {
                $siswa = Siswa::find($siswaId);
                if (!$siswa) continue;
                 if (is_null($siswa->user_id)) {
                    $newUser = User::create([
                        'name' => $siswa->nama,
                        'email' => $siswa->nis,
                        'nis' => $siswa->nis,
                        'password' => Hash::make($siswa->nis),
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
            $sesiUjian->pesertas()->sync($userIdsToSync);

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
            'data' => $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran', 'jadwalSlots.pengawas'])
        ]);
    }

    public function destroy(SesiUjian $sesiUjian)
    {
        $sesiUjian->delete();
        return response()->json(['message' => 'Sesi ujian berhasil dihapus.']);
    }
}