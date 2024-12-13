<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PasienController extends Controller
{
    /**
     * Menampilkan daftar semua pasien.
     */
    public function index()
    {
        return response()->json(Pasien::all());
    }

    /**
     * Menambahkan pasien oleh admin.
     */
    public function store(Request $request)
    {
        // Validasi data input
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp',
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp',
            'no_rm' => 'required|string|size:10|unique:pasien,no_rm', // Admin input manual
        ]);

        // Simpan data pasien
        $pasien = Pasien::create($validatedData);

        return response()->json([
            'message' => 'Pasien berhasil ditambahkan',
            'pasien' => $pasien,
        ], 201);
    }

    /**
     * Registrasi pasien baru oleh pasien sendiri.
     */
    public function register(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp',
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp',
            'password' => 'required|string|min:8', // Hanya ada di register
        ]);

        // Generate nomor rekam medis (no_rm)
        $currentYearMonth = now()->format('Ym'); // Format: YYYYMM
        $lastPasien = Pasien::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastPasien ? (int)substr($lastPasien->no_rm, -3) + 1 : 1;
        $generatedNoRM = now()->format('Y') . now()->format('m') . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Hashing password
        $hashedPassword = Hash::make($validatedData['password']);

        // Simpan data pasien
        $pasien = Pasien::create([
            'nama' => $validatedData['nama'],
            'alamat' => $validatedData['alamat'],
            'no_ktp' => $validatedData['no_ktp'],
            'no_hp' => $validatedData['no_hp'],
            'password' => $hashedPassword,
            'no_rm' => $generatedNoRM,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'pasien' => $pasien,
        ], 201);
    }

    /**
     * Menampilkan data pasien berdasarkan ID.
     */
    public function show($id)
    {
        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        return response()->json($pasien);
    }

    /**
     * Memperbarui data pasien.
     */
    public function update(Request $request, $id)
    {
        // Validasi data input
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp,' . $id,
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp,' . $id,
            'no_rm' => 'required|string|size:10|unique:pasien,no_rm,' . $id,
            'password' => 'nullable|string|min:8', // Opsional
        ]);

        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        // Hash password jika diubah
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Perbarui data pasien
        $pasien->update($validatedData);

        return response()->json([
            'message' => 'Data pasien berhasil diperbarui',
            'pasien' => $pasien,
        ]);
    }

    /**
     * Menghapus pasien.
     */
    public function destroy($id)
    {
        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        $pasien->delete();

        return response()->json(['message' => 'Pasien berhasil dihapus']);
    }
}
