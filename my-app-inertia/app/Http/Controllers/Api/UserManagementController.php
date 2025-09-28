<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'pengawas', 'siswa'])],
        ]);

        $users = User::where('role', $validated['role'])
            ->orderBy('name', 'asc')
            ->get();

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

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus.']);
    }
}