<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    use HasFactory;

    protected $table = 'pasien';

    protected $fillable = ['nama', 'alamat', 'no_ktp', 'no_hp', 'no_rm', 'password'];

    protected $hidden = ['password']; // Sembunyikan password saat serialisasi

    public function dokter()
{
    return $this->belongsTo(Dokter::class, 'dokter_id');
}


}