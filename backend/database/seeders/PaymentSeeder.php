<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $residentIds = DB::table('residents')->pluck('resident_id')->toArray();

        if (empty($residentIds)) {
            echo "Pastikan tabel residents sudah memiliki data.\n";
            return;
        }

        for ($i = 0; $i < 30; $i++) {
            $month = rand(1, 12);
            $year = rand(2024, 2025);
            $day = rand(1, 28); // biar aman
            $paymentDate = Carbon::create($year, $month, $day);

            DB::table('payments')->insert([
                'resident_id'   => $residentIds[array_rand($residentIds)],
                'payment_type'  => ['Kebersihan', 'Satpam'][rand(0, 1)],
                'month'         => $month,
                'amount'        => rand(50000, 150000),
                'payment_date'  => $paymentDate,
            ]);
        }
    }
}
