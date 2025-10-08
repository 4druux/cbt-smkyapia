<?php

namespace App\Http\Controllers\Api\ManajemenUjian;

use App\Http\Controllers\Controller;
use App\Models\Ruangan;
use App\Models\SesiUjian;
use Illuminate\Http\Request;

class RuanganController extends Controller
{
    public function index()
    {
        return response()->json(Ruangan::orderBy('kode_ruangan', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'kode_ruangan' => 'required|string|max:255|unique:ruangans',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $ruangan = Ruangan::create($validated);

        return response()->json([
            'message' => 'Ruangan berhasil ditambahkan.',
            'data' => $ruangan
        ], 201);
    }

    public function show(Ruangan $ruangan)
    {
        return response()->json($ruangan);
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'kode_ruangan' => 'required|string|max:255|unique:ruangans,kode_ruangan,' . $ruangan->id,
            'kapasitas' => 'required|integer|min:1',
        ]);

        $ruangan->update($validated);

        return response()->json([
            'message' => 'Ruangan berhasil diperbarui.',
            'data' => $ruangan
        ]);
    }

    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();

        return response()->json(['message' => 'Ruangan berhasil dihapus.']);
    }

    public function getAvailableRuangans(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'exclude_session_id' => 'nullable|exists:sesi_ujians,id'
        ]);

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $excludeSessionId = $request->query('exclude_session_id');

        $bookedRoomIds = SesiUjian::where(function ($query) use ($startDate, $endDate) {
                $query->where('tanggal_mulai', '<=', $endDate)
                ->where('tanggal_selesai', '>=', $startDate);
        })
        ->when($excludeSessionId, function ($query) use ($excludeSessionId) {
            return $query->where('id', '!=', $excludeSessionId);
        })
        ->pluck('ruangan_id')
        ->unique();

        $availableRuangans = Ruangan::whereNotIn('id', $bookedRoomIds)->get();
        return response()->json($availableRuangans);
    }
}