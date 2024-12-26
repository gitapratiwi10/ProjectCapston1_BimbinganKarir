<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPeriksa extends Model
{
    use HasFactory;

    protected $table = 'jadwal_periksa';

    protected $fillable = [
        'id_dokter',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'status',
    ];

    public $timestamps = true;

    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'id_dokter');
    }

    public function daftarPoli()
{
    return $this->hasMany(DaftarPoli::class, 'id_jadwal');
}

public function poli()
{
    return $this->belongsTo(Poli::class, 'id_poli');
}



    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeTidakAktif($query)
    {
        return $query->where('status', 'tidak aktif');
    }

    public function setStatusAttribute($value)
    {
        $allowedStatuses = ['aktif', 'tidak aktif', 'non-aktif'];
        if (!in_array($value, $allowedStatuses)) {
            throw new \InvalidArgumentException('Status harus "aktif", "tidak aktif", atau "non-aktif".');
        }
        $this->attributes['status'] = $value === 'non-aktif' ? 'tidak aktif' : $value;
    }
}
