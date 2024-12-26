<?php
/*
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 
|
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DokterController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\PoliController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\DashboardAdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\JadwalPeriksaController;
use App\Http\Controllers\DaftarPoliController;
use App\Http\Controllers\PeriksaController;
use App\Http\Controllers\RiwayatPasienController;
use Illuminate\Support\Facades\Route;


Route::resource('dokters', DokterController::class)->except(['create', 'edit']);
Route::resource('pasien', PasienController::class)->except(['create', 'edit']);
Route::resource('polis', PoliController::class)->except(['create', 'edit']);
Route::resource('obat', ObatController::class)->except(['create', 'edit']);
// Route::resource('jadwal-perika', JadwalPeriksaController::class)->except(['create', 'edit']);
Route::get('/dokter/jumlah', [DashboardAdminController::class, 'countDokters']);
Route::get('/pasiens/jumlah', [DashboardAdminController::class, 'countPasiens']);
Route::get('/poli/jumlah', [DashboardAdminController::class, 'countPolies']);
Route::post('/register', [PasienController::class, 'register']);
Route::post('/loginuser', [LoginController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/jadwal-periksa', [JadwalPeriksaController::class, 'index']);
Route::get('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'show']);
Route::post('/jadwal-periksa', [JadwalPeriksaController::class, 'store']);
Route::put('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'update']);
Route::delete('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'destroy']);
Route::get('/jadwal-periksa', [JadwalPeriksaController::class, 'fetchJadwal']);

Route::get('/daftar-poli', [DaftarPoliController::class, 'index']);         // Semua daftar poli
Route::get('/daftar-poli/{id}', [DaftarPoliController::class, 'show']);     // Detail daftar poli
Route::post('/daftar-poli', [DaftarPoliController::class, 'store']);        // Tambah daftar poli
Route::get('/jadwalperiksa/poli/{id_poli}', [DaftarPoliController::class, 'getJadwalByPoli']); // Jadwal berdasarkan poli
Route::get('/riwayat-poli/{id_pasien}', [DaftarPoliController::class, 'riwayatPasien']);
Route::put('/daftar-poli/{id}/status', [DaftarPoliController::class, 'StatusUpdate']);

Route::get('/data-periksa/{id_dokter}', [PeriksaController::class, 'index']);
Route::post('/periksa', [PeriksaController::class, 'store']);
Route::get('/periksa/{id}', [PeriksaController::class, 'show']);
Route::get('/riwayat-pasien/{id_pasien}', [PeriksaController::class, 'riwayatPasien']);
Route::get('/detail-riwayat/{id}', [PeriksaController::class, 'detailRiwayat']);
Route::put('/periksa/edit/{id}', [PeriksaController::class, 'update']);


Route::get('/patients/history/{id_dokter}', [RiwayatPasienController::class, 'index']);
Route::get('/patients/{id_pasien}/detail', [RiwayatPasienController::class, 'detailForDokter']);
Route::get('/detail-riwayat-pasien/{id}', [RiwayatPasienController::class, 'detailForPasien']);