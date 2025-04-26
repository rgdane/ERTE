<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResidentHistory extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'resident_histories';
    protected $primaryKey = 'resident_history_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'resident_id',
        'house_id',
        'start_date',
        'end_date'
    ];

    public function resident() {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }
    
    public function house() {
        return $this->belongsTo(House::class, 'house_id', 'house_id');
    }
}
