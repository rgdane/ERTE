<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'residents';
    protected $primaryKey = 'resident_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'resident_fullname',
        'resident_phone',
        'is_permanent',
        'is_married',
        'resident_id_card',
        'is_active'
    ];

    public function houseHistories() {
        return $this->hasMany(ResidentHistory::class);
    }
}
