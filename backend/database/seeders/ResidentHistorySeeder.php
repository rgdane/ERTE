<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResidentHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $residentIds = DB::table('residents')->pluck('resident_id')->toArray();
        $houseIds = DB::table('houses')->pluck('house_id')->toArray();

        if (empty($residentIds) || empty($houseIds)) {
            echo "Pastikan tabel residents dan houses sudah memiliki data.\n";
            return;
        }

        for ($i = 1; $i <= 20; $i++) {
            $startYear = rand(2024, 2025);
            $startMonth = rand(1, 12);
            $startDate = Carbon::create($startYear, $startMonth, rand(1, 28));

            $endDate = rand(0, 1) ? $startDate->copy()->addMonths(rand(1, 6)) : null;

            DB::table('resident_histories')->insert([
                'resident_id' => $residentIds[array_rand($residentIds)],
                'house_id' => $houseIds[array_rand($houseIds)],
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
        }
    }
}
