<?php

namespace App\Http\Controllers\Api\ManajemenRuangan;

use App\Http\Controllers\Controller;
use App\Models\Ruangan;
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
}