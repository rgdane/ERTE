<?php

namespace App\Enums;

enum ExpenseType: string
{
    case KEBERSIHAN = 'Kebersihan';
    case SATPAM = 'Satpam';
    case LAINNYA = 'Lainnya';
}