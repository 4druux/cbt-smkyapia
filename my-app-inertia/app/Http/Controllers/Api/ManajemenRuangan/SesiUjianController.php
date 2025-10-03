<?php

namespace App\Http\Controllers\Api\ManajemenRuangan;

use App\Http\Controllers\Controller;
use App\Models\SesiUjian;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class SesiUjianController extends Controller
{
    public function index()
    {
        $sesiUjians = SesiUjian::with([
            'ruangan', 
            'academicYear', 
            'pesertas', 
            'jadwalSlots.mataPelajaran'
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
            'peserta_ids' => 'required|array|min:1',
            'peserta_ids.*' => 'exists:siswas,id',
            'jadwal_slots' => 'required|array|min:1',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.mata_pelajaran_id' => [
                function ($attribute, $value, $fail) {
                    if (is_null($value)) return;
                    if ($value === 'istirahat') return;
                    if (!DB::table('mata_pelajarans')->where('id', $value)->exists()) {
                        $fail('Mata pelajaran yang dipilih tidak valid.');
                    }
                },
            ],
            'jadwal_slots.*.pengawas_id' => [
                'nullable',
                'required_if:jadwal_slots.*.mata_pelajaran_id,!=,istirahat', 
                'exists:users,id', 
            ],
        ]);

        $sesiUjian = DB::transaction(function () use ($validated, $request) {
            $sesiData = Arr::except($validated, ['peserta_ids', 'jadwal_slots']);
            $newSesiUjian = SesiUjian::create($sesiData);
        
            $finalUserIds = [];
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

                    $finalUserIds[] = $newUser->id;
                } else {
                    $finalUserIds[] = $siswa->user_id;
                }
            }

            $newSesiUjian->pesertas()->sync($finalUserIds);

            if (isset($validated['jadwal_slots'])) {
                foreach ($validated['jadwal_slots'] as $slotData) {
                    if (isset($slotData['mata_pelajaran_id']) && $slotData['mata_pelajaran_id'] === 'istirahat') {
                        $slotData['mata_pelajaran_id'] = null;
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
        return response()->json($sesiUjian->load(['ruangan', 'academicYear', 'pesertas', 'jadwalSlots.mataPelajaran']));
    }

    public function update(Request $request, SesiUjian $sesiUjian)
    {
         $validated = $request->validate([
            'ruangan_id' => 'required|exists:ruangans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:ganjil,genap',
            'jenis_asesmen' => 'required|in:asts,asas',
            'peserta_ids' => 'required|array|min:1',
            'peserta_ids.*' => 'exists:users,id',
            'jadwal_slots' => 'required|array|min:1',
            'jadwal_slots.*.hari' => ['required', 'string', 'max:255'],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
        ]);

        DB::transaction(function () use ($validated, $sesiUjian) {
            $sesiUjian->update($validated);
            $sesiUjian->pesertas()->sync($validated['peserta_ids']);
            $sesiUjian->jadwalSlots()->delete();
            foreach ($validated['jadwal_slots'] as $slotData) {
                $sesiUjian->jadwalSlots()->create($slotData);
            }
        });

        return response()->json([
            'message' => 'Sesi ujian berhasil diperbarui.',
            'data' => $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran'])
        ]);
    }

    public function destroy(SesiUjian $sesiUjian)
    {
        $sesiUjian->delete();
        return response()->json(['message' => 'Sesi ujian berhasil dihapus.']);
    }
}