<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenseTypes = ['Kebersihan', 'Satpam', 'Lainnya'];
        $descriptions = [
            'Pembelian alat kebersihan',
            'Gaji satpam',
            'Perbaikan fasilitas umum',
            'Konsumsi rapat RT'
        ];

        for ($i = 0; $i < 30; $i++) {
            $month = rand(1, 12);
            $year = rand(2024, 2025);
            $day = rand(1, 28); // aman untuk semua bulan
            $expenseDate = Carbon::create($year, $month, $day);

            DB::table('expenses')->insert([
                'expense_type'        => $expenseTypes[array_rand($expenseTypes)],
                'expense_description' => rand(0, 1) ? $descriptions[array_rand($descriptions)] : null,
                'amount'              => rand(50000, 200000),
                'expense_date'        => $expenseDate,
            ]);
        }
    }
}
