<?php

namespace App\Http\Controllers\Api\DataSiswa;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DataSiswaController extends Controller
{
    private function registerSiswaAsUser(Siswa $siswa)
    {
        if (User::where('nis', $siswa->nis)->exists()) {
            return;
        }

        $user = User::create([
            'name' => $siswa->nama,
            'nis' => $siswa->nis,
            'password' => Hash::make(substr($siswa->nis, -8)),
            'role' => 'siswa',
            'approved_at' => now(),
        ]);

        $siswa->user_id = $user->id;
        $siswa->save();
    }

    public function createSiswa(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'kelas_id' => 'required|exists:kelas,id',
                'tahun_ajaran' => 'required|exists:academic_years,year',
                'students' => 'required|array|min:1',
                'students.*.nis' => 'required|string',
                'students.*.nama' => 'required|string|max:255',
                'students.*.jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            ]);

            $academicYear = AcademicYear::where('year', $validated['tahun_ajaran'])->firstOrFail();

            $allNis = collect($validated['students'])->pluck('nis');
            $existingSiswa = Siswa::where('academic_year_id', $academicYear->id)
                ->whereIn('nis', $allNis)
                ->first();

            if ($existingSiswa) {
                throw ValidationException::withMessages([
                    'students' => ["Siswa dengan NIS {$existingSiswa->nis} sudah terdaftar di tahun ajaran ini."],
                ]);
            }

            foreach ($validated['students'] as $studentData) {
                $siswa = Siswa::create([
                    'nis' => $studentData['nis'],
                    'nama' => $studentData['nama'],
                    'jenis_kelamin' => $studentData['jenis_kelamin'],
                    'kelas_id' => $validated['kelas_id'],
                    'academic_year_id' => $academicYear->id,
                ]);
                $this->registerSiswaAsUser($siswa);
            }

            DB::commit();
            return response()->json(['message' => 'Data siswa berhasil disimpan.'], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal createSiswa: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan internal.'], 500);
        }
    }

    public function storeSingleStudent(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran' => 'required|exists:academic_years,year',
            'nis' => 'required|string',
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
        ]);

        $academicYear = AcademicYear::where('year', $validated['tahun_ajaran'])->firstOrFail();

        $existingSiswa = Siswa::where('nis', $validated['nis'])
            ->where('academic_year_id', $academicYear->id)
            ->exists();

        if ($existingSiswa) {
            return response()->json([
                'message' => 'Siswa dengan NIS ini sudah terdaftar pada tahun ajaran yang sama.',
                'errors' => ['nis' => ['NIS sudah ada di tahun ajaran ini.']]
            ], 422);
        }

        $siswa = null;
        DB::transaction(function () use ($validated, $academicYear, &$siswa) {
            $siswa = Siswa::create([
                'nis' => $validated['nis'],
                'nama' => $validated['nama'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'kelas_id' => $validated['kelas_id'],
                'academic_year_id' => $academicYear->id,
            ]);
            $this->registerSiswaAsUser($siswa);
        });

        return response()->json(['message' => 'Siswa berhasil ditambahkan.', 'siswa' => $siswa], 201);
    }

    public function updateSiswa(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => [
                'required', 'string',
                Rule::unique('siswas')->where(function ($query) use ($siswa) {
                    return $query->where('academic_year_id', $siswa->academic_year_id);
                })->ignore($siswa->id)
            ],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
        ]);

        $siswa->update($validated);

        return response()->json(['message' => 'Data siswa berhasil diperbarui.', 'siswa' => $siswa]);
    }

    public function deleteSiswa(Siswa $siswa)
    {
        $siswa->delete();
        return response()->json(['message' => 'Siswa berhasil dihapus.']);
    }

    public function promoteStudents(Request $request)
    {
        $validated = $request->validate([
            'current_kelas_id' => 'required|exists:kelas,id',
            'current_tahun_ajaran' => 'required|exists:academic_years,year',
            'new_kelas_id' => 'required|exists:kelas,id',
            'new_tahun_ajaran' => 'required|exists:academic_years,year',
        ]);

        $currentAcademicYear = AcademicYear::where('year', $validated['current_tahun_ajaran'])->firstOrFail();
        $newAcademicYear = AcademicYear::where('year', $validated['new_tahun_ajaran'])->firstOrFail();

        DB::transaction(function () use ($validated, $currentAcademicYear, $newAcademicYear) {
            $studentsToPromote = Siswa::where('kelas_id', $validated['current_kelas_id'])
                ->where('academic_year_id', $currentAcademicYear->id)
                ->get();

            if ($studentsToPromote->isEmpty()) {
                 throw new \Exception('Tidak ada siswa untuk dinaikkan kelas.');
            }

            foreach ($studentsToPromote as $student) {
                $alreadyExists = Siswa::where('nis', $student->nis)
                                      ->where('academic_year_id', $newAcademicYear->id)
                                      ->exists();

                if ($alreadyExists) {
                    throw ValidationException::withMessages([
                        'siswa_exist' => ["Siswa '{$student->nama}' (NIS: {$student->nis}) sudah terdaftar di tahun ajaran tujuan."],
                    ]);
                }

                Siswa::create([
                    'nis' => $student->nis,
                    'nama' => $student->nama,
                    'jenis_kelamin' => $student->jenis_kelamin,
                    'kelas_id' => $validated['new_kelas_id'],
                    'academic_year_id' => $newAcademicYear->id,
                ]);
            }
        });

        return response()->json(['message' => 'Siswa berhasil dinaikkan kelas dan histori telah disimpan.']);
    }
}