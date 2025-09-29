<?php

namespace App\Http\Controllers\Api\ManajemenRuangan;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;

class MataPelajaranController extends Controller
{
    public function index()
    {
        return response()->json(MataPelajaran::orderBy('nama_mapel', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:255',
            'kode_mapel' => 'required|string|max:255|unique:mata_pelajarans',
        ]);

        $mataPelajaran = MataPelajaran::create($validated);

        return response()->json([
            'message' => 'Mata pelajaran berhasil ditambahkan.',
            'data' => $mataPelajaran
        ], 201);
    }

    public function show(MataPelajaran $mataPelajaran)
    {
        return response()->json($mataPelajaran);
    }

    public function update(Request $request, MataPelajaran $mataPelajaran)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:255',
            'kode_mapel' => 'required|string|max:255|unique:mata_pelajarans,kode_mapel,' . $mataPelajaran->id,
        ]);

        $mataPelajaran->update($validated);

        return response()->json([
            'message' => 'Mata pelajaran berhasil diperbarui.',
            'data' => $mataPelajaran
        ]);
    }

    public function destroy(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->delete();

        return response()->json(['message' => 'Mata pelajaran berhasil dihapus.']);
    }
}