<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Dokter extends Model
{
    use HasFactory;

    protected $table = 'dokter';

    protected $fillable = ['nama', 'alamat', 'no_hp', 'id_poli', 'password'];

    // Relationship with Poli model
    public function poli()
    {
        return $this->belongsTo(Poli::class, 'id_poli');
    }

    public function jadwalPeriksa()
    {
        return $this->hasMany(JadwalPeriksa::class, 'id_dokter');
    }

    public function pasien()
    {
        return $this->hasMany(Pasien::class, 'dokter_id');
    }
}
