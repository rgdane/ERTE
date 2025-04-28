<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'resident_id',
        'payment_type',
        'month',
        'amount',
        'payment_date',
        'month_period',
        'year_period',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }
}
