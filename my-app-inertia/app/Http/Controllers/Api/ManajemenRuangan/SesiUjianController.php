<?php

namespace App\Http\Controllers\Api\ManajemenRuangan;

use App\Http\Controllers\Controller;
use App\Models\SesiUjian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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
            'peserta_ids.*' => 'exists:users,id',
            'jadwal_slots' => 'required|array|min:1',
            'jadwal_slots.*.hari' => ['required', Rule::in(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'])],
            'jadwal_slots.*.waktu_mulai' => 'required|date_format:H:i',
            'jadwal_slots.*.waktu_selesai' => 'required|date_format:H:i|after:jadwal_slots.*.waktu_mulai',
            'jadwal_slots.*.mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
        ]);

        $sesiUjian = DB::transaction(function () use ($validated) {
            $newSesiUjian = SesiUjian::create($validated);

            $newSesiUjian->pesertas()->sync($validated['peserta_ids']);

            foreach ($validated['jadwal_slots'] as $slotData) {
                $newSesiUjian->jadwalSlots()->create($slotData);
            }

            return $newSesiUjian;
        });
        
        $sesiUjian->load(['ruangan', 'pesertas', 'jadwalSlots.mataPelajaran']);

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
            'jadwal_slots.*.hari' => ['required', Rule::in(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'])],
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