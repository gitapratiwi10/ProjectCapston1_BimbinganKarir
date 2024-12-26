<?php

namespace App\Http\Controllers;

use App\Models\DaftarPoli;
use App\Models\Poli;
use App\Models\Pasien;
use App\Models\JadwalPeriksa;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class DaftarPoliController extends Controller
{
    public function index()
    {
        $daftarPoli = DaftarPoli::with(['pasien', 'jadwal', 'poli'])->get();
        return response()->json($daftarPoli, 200);
    }

    public function getJadwalByPoli($id_poli)
    {
        $jadwal = JadwalPeriksa::where('status', 'aktif')
            ->whereHas('dokter', function ($query) use ($id_poli) {
                $query->where('id_poli', $id_poli);
            })
            ->with('dokter.poli')
            ->get();

        if ($jadwal->isEmpty()) {
            return response()->json(['message' => 'Tidak ada jadwal periksa aktif untuk poli ini.'], 404);
        }

        return response()->json($jadwal, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_pasien' => 'required|exists:pasien,id',
            'id_jadwal' => 'required|exists:jadwal_periksa,id',
            'keluhan' => 'required|string',
        ]);

        $jadwal = JadwalPeriksa::find($validatedData['id_jadwal']);

        if (!$jadwal) {
            return response()->json(['message' => 'Jadwal tidak ditemukan.'], 404);
        }

        $hariIni = now()->toDateString();
        $jumlahAntrian = DaftarPoli::where('id_jadwal', $validatedData['id_jadwal'])
            ->whereDate('created_at', $hariIni)
            ->count();

        $validatedData['no_antrian'] = $jumlahAntrian + 1;
        $validatedData['status'] = 'Belum Diperiksa'; // Format seragam


        $daftarPoli = DaftarPoli::create($validatedData);

        return response()->json($daftarPoli, 201);
    }

    public function show($id)
    {
        $daftarPoli = DaftarPoli::with(['pasien', 'jadwal', 'poli'])->find($id);

        if (!$daftarPoli) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        return response()->json($daftarPoli, 200);
    }

    public function riwayatPasien($id_pasien)
    {
        try {
            $riwayatPoli = DaftarPoli::where('id_pasien', $id_pasien)
                ->with([
                    'jadwal.dokter.poli',
                    'jadwal'
                ])
                ->get()
                ->map(function ($item) {
                    $hariIndo = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                    $hari = in_array($item->jadwal->hari, $hariIndo) ? $item->jadwal->hari : 'N/A';

                    return [
                        'id' => $item->id,
                        'Poli' => optional($item->jadwal->dokter->poli)->nama_poli ?? 'N/A',
                        'Dokter' => optional($item->jadwal->dokter)->nama ?? 'N/A',
                        'Hari' => $hari,
                        'Mulai' => $item->jadwal->jam_mulai ?? 'N/A',
                        'Selesai' => $item->jadwal->jam_selesai ?? 'N/A',
                        'Antrian' => $item->no_antrian,
                        'Status' => $item->status,
                    ];
                });

            if ($riwayatPoli->isEmpty()) {
                return response()->json(['message' => 'Tidak ada riwayat poli untuk pasien ini.'], 200);
            }

            return response()->json($riwayatPoli, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching riwayat poli:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        public function StatusUpdate($id)
        {
           
            $daftarPoli = DaftarPoli::find($id);

            if (!$daftarPoli) {
                return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
            }

    
            $daftarPoli->status = 'Sudah Diperiksa';
            $daftarPoli->save();

            return response()->json([
                'message' => 'Status berhasil diperbarui.',
                'data' => $daftarPoli
            ], 200);
        }
}
