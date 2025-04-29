<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resident>
 */
class ResidentFactory extends Factory
{

public function definition()
{
    return [
        'resident_fullname' => $this->faker->name(),
        'resident_phone' => $this->faker->phoneNumber(),
        'is_permanent' => $this->faker->boolean(),
        'is_married' => $this->faker->boolean(),
        'resident_id_card' => 'ktp/oGZhL0vmCGyE4uqAzkN5Z7Eiaw1i8vBqfyu2As3l.png',
        'is_active' => $this->faker->boolean(),
        'created_at' => now(),
        'updated_at' => now(),
    ];
}

}
