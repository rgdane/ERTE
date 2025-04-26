<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class House extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'houses';
    protected $primaryKey = 'house_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'house_address',
        'is_occupied',
    ];

    public function histories() {
        return $this->hasMany(ResidentHistory::class);
    }
    
    public function currentResident() {
        return $this->hasOne(ResidentHistory::class)->whereNull('end_date');
    }
    
}
