<?php

namespace App\Http\Controllers;

use App\Models\JadwalPeriksa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Pastikan menggunakan Log facade

class JadwalPeriksaController extends Controller
{
    // Menampilkan daftar jadwal periksa
    public function index()
    {
        $jadwalPeriksa = JadwalPeriksa::all();
        return response()->json($jadwalPeriksa);
    }

    // Menampilkan jadwal periksa berdasarkan ID
    public function show($id)
    {
        $jadwal = JadwalPeriksa::find($id);

        if (!$jadwal) {
            return response()->json(['message' => 'Jadwal tidak ditemukan'], 404);
        }

        return response()->json($jadwal);
    }

    // Membuat jadwal periksa baru
    public function store(Request $request)
{
    // Log semua data yang diterima
    Log::info('Data yang diterima untuk tambah jadwal:', $request->all());

    $validatedData = $request->validate([
        'id_dokter' => 'required|exists:dokter,id', // Pastikan id_dokter valid
        'hari' => 'required|string',
        'jam_mulai' => 'required|date_format:H:i',
        'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        'status' => 'required|string|in:aktif,tidak aktif,non-aktif',
    ]);

    try {

        $existingJadwal = JadwalPeriksa::where('id_dokter', $validatedData['id_dokter'])
        ->where('hari', $validatedData['hari'])
        ->first();

        if($existingJadwal){
            return response()->json(['error' => 'Hari sama sudah terdaftar'], 400);
        }


        if ($validatedData['status'] === 'aktif') {
            // Ubah semua jadwal aktif dari dokter yang sama menjadi tidak aktif
            JadwalPeriksa::where('id_dokter', $validatedData['id_dokter'])
                ->where('status', 'aktif')
                ->update(['status' => 'tidak aktif']);
        }

        // Simpan jadwal baru
        $jadwal = JadwalPeriksa::create($validatedData);
        return response()->json($jadwal, 201); // 201 Created
    } catch (\Exception $e) {
        // Log error untuk debugging
        Log::error('Gagal menambahkan jadwal periksa:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json(['error' => 'Terjadi kesalahan saat menyimpan data.'], 500);
    }
}



    // Mengupdate jadwal periksa
    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'hari' => 'sometimes|required|string',
        'jam_mulai' => 'sometimes|required|date_format:H:i',
        'jam_selesai' => 'sometimes|required|date_format:H:i|after:jam_mulai',
        'status' => 'sometimes|required|string|in:aktif,tidak aktif,non-aktif',
    ]);

    $jadwalPeriksa = JadwalPeriksa::find($id);

    if (!$jadwalPeriksa) {
        return response()->json(['error' => 'Jadwal tidak ditemukan'], 404);
    }

    // Jika status diubah dari tidak aktif menjadi aktif
    if ($jadwalPeriksa->status !== 'aktif' && $request->status === 'aktif') {
        // Nonaktifkan semua jadwal lain milik dokter ini
        JadwalPeriksa::where('id_dokter', $jadwalPeriksa->id_dokter)
            ->where('id', '!=', $id)
            ->update(['status' => 'tidak aktif']);
    }

    // Perbarui data jadwal
    $jadwalPeriksa->update($validatedData);

    // Return response
    return response()->json([
        'message' => 'Jadwal berhasil diperbarui.',
        'jadwal' => $jadwalPeriksa,
    ]);
}

    

    

    // Menghapus jadwal periksa
    public function destroy($id)
    {
        $jadwal = JadwalPeriksa::find($id);

        if (!$jadwal) {
            return response()->json(['message' => 'Jadwal tidak ditemukan'], 404);
        }

        $jadwal->delete();
        return response()->json(['message' => 'Jadwal berhasil dihapus']);
    }

    public function fetchJadwal(Request $request)
    {
        $id_dokter = $request->query('id_dokter'); // Mendapatkan id_dokter dari parameter query string
        
        // Filter jadwal berdasarkan id_dokter
        $jadwalPeriksa = JadwalPeriksa::where('id_dokter', $id_dokter)->get();

        // Kembalikan data dalam format JSON
        return response()->json($jadwalPeriksa);
    }
}
