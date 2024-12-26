<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DaftarPoli;
use App\Models\Periksa;

class RiwayatPasienController extends Controller
{
    public function index(Request $request, $id_dokter)
    {
        try {
            $daftarPoli = DaftarPoli::with(['pasien', 'jadwal'])
                ->whereHas('jadwal', function ($query) use ($id_dokter) {
                    $query->where('id_dokter', $id_dokter);
                })
                ->where('status', 'Sudah Diperiksa')
                ->get();

            if ($daftarPoli->isEmpty()) {
                return response()->json(['message' => 'Tidak ada riwayat pasien untuk dokter ini.'], 200);
            }

            return response()->json($daftarPoli, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function detailForPasien(Request $request, $id_daftar_poli)
    {
        $id_pasien = $request->query('id_pasien');
        if (!$id_pasien) {
            return response()->json(['message' => 'ID pasien tidak diberikan.'], 400);
        }

        try {
            $query = Periksa::with([
                'daftarPoli.jadwal.dokter',
                'daftarPoli.jadwal.dokter.poli',
                'daftarPoli.pasien',
                'detailPeriksa.obat'
            ]);

            $query->whereHas('daftarPoli', function ($subQuery) use ($id_pasien, $id_daftar_poli) {
                $subQuery->where('id_pasien', $id_pasien)
                         ->where('id', $id_daftar_poli);
            });

            $detail = $query->latest()->first();

            if (!$detail) {
                return response()->json(['message' => 'Data riwayat pasien tidak ditemukan.'], 404);
            }

            $response = $this->formatDetailResponse($detail);

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function detailForDokter($id_pasien, Request $request)
    {
        $id_dokter = $request->get('id_dokter');

        try {
            $query = Periksa::with([
                'daftarPoli.jadwal.dokter',
                'daftarPoli.jadwal.dokter.poli',
                'daftarPoli.pasien',
                'detailPeriksa.obat'
            ]);

            $query->whereHas('daftarPoli', function ($subQuery) use ($id_pasien, $id_dokter) {
                $subQuery->where('id_pasien', $id_pasien)
                         ->whereHas('jadwal.dokter', function ($doctorQuery) use ($id_dokter) {
                             $doctorQuery->where('id', $id_dokter);
                         });
            });

            $detail = $query->latest()->first();

            if (!$detail) {
                return response()->json(['message' => 'Data riwayat pasien tidak ditemukan.'], 404);
            }

            $response = $this->formatDetailResponse($detail);

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function formatDetailResponse($detail)
    {
        $obatList = $detail->detailPeriksa->map(function ($detailPeriksa) {
            return [
                'nama_obat' => $detailPeriksa->obat->nama_obat ?? 'Tidak ada nama obat',
                'harga' => $detailPeriksa->obat->harga ?? 0,
            ];
        });

        return [
            'nama' => $detail->daftarPoli->pasien->nama ?? 'Tidak ditemukan',
            'alamat' => $detail->daftarPoli->pasien->alamat ?? 'Tidak ditemukan',
            'no_ktp' => $detail->daftarPoli->pasien->no_ktp ?? 'Tidak ditemukan',
            'no_hp' => $detail->daftarPoli->pasien->no_hp ?? 'Tidak ditemukan',
            'keluhan' => $detail->daftarPoli->keluhan ?? 'Tidak ada keluhan',
            'tgl_periksa' => $detail->tgl_periksa ?? null,
            'catatan' => $detail->catatan,
            'poli' => $detail->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak ditemukan',
            'dokter' => $detail->daftarPoli->jadwal->dokter->nama ?? 'Tidak ditemukan',
            'no_antrian' => $detail->daftarPoli->no_antrian ?? 'Tidak ditemukan',
            'obat' => $obatList->toArray(),
            'hari' => $detail->daftarPoli->jadwal->hari ?? 'N/A',
            'jam_mulai' => $detail->daftarPoli->jadwal->jam_mulai ?? 'N/A',
            'jam_selesai' => $detail->daftarPoli->jadwal->jam_selesai ?? 'N/A',
            'biaya_total' => $detail->biaya_periksa ?? 0,
        ];
    }
}
