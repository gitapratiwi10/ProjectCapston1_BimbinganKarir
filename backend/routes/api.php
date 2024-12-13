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
use Illuminate\Support\Facades\Route;


Route::resource('dokters', DokterController::class)->except(['create', 'edit']);
Route::resource('pasien', PasienController::class)->except(['create', 'edit']);
Route::resource('polis', PoliController::class)->except(['create', 'edit']);
Route::resource('obat', ObatController::class)->except(['create', 'edit']);
Route::get('/dokter/jumlah', [DashboardAdminController::class, 'countDokters']);
Route::get('/pasiens/jumlah', [DashboardAdminController::class, 'countPasiens']);
Route::get('/poli/jumlah', [DashboardAdminController::class, 'countPolies']);
Route::post('/register', [PasienController::class, 'register']);
Route::post('/loginuser', [LoginController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']);



