<?php

namespace App\Http\Controllers;
use App\Models\Pasien;
use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'no_ktp' => 'required|string',
            'password' => 'required|string',
        ]);

        // Cari pasien berdasarkan no_hp
        $pasien = Pasien::where('no_ktp', $validatedData['no_ktp'])->first();

        if (!$pasien) {
            return response()->json(['message' => 'No KTP tidak ditemukan'], 404);
        }

        // Verifikasi password
        if (!Hash::check($validatedData['password'], $pasien->password)) {
            return response()->json(['message' => 'Password salah'], 401);
        }

        // Return data pasien (atau token jika sistem autentikasi menggunakan JWT)
        return response()->json([
            'message' => 'Login berhasil',
            'pasien' => $pasien,
        ]);
    }

}
