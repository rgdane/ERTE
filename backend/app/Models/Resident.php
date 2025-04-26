<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;
    protected $table = 'residents';
    protected $primaryKey = 'resident_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'resident_fullname',
        'resident_phone',
        'is_permanent',
        'is_married',
        'resident_id_card'
    ];
}
