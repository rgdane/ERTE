<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'expenses';
    protected $primaryKey = 'expense_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'expense_type',
        'expense_description',
        'amount',
        'expense_date',
        'month_period',
        'year_period',
    ];
}
