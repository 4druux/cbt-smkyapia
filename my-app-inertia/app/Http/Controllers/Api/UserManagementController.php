<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'pengawas', 'siswa'])],
            'search' => 'nullable|string',
        ]);

        $query = User::where('role', $validated['role']);

        if ($validated['role'] === 'siswa') {
            $query->with(['siswa.kelas', 'siswa.academicYear']);
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_peserta', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('name', 'asc')->get();

        return response()->json($users);
    }

    public function approve(User $user)
    {
        if ($user->approved_at) {
            return response()->json(['message' => 'Pengguna ini sudah disetujui.'], 409);
        }

        $user->update(['approved_at' => now()]);

        return response()->json(['message' => 'Pengguna berhasil disetujui.']);
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Password pengguna berhasil direset.']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $email = Str::slug($validated['name'], '') . '@smkyapia.com';
        $password = '12345678'; 

        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'pengawas',
            'approved_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pengawas berhasil ditambahkan.',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user->update([
            'name' => $validated['name'],
        ]);

        return response()->json([
            'message' => 'Data pengguna berhasil diperbarui.',
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus.']);
    }
}