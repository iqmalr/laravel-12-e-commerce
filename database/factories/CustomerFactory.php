<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'birthdate' => fake()->date(),
            'birthplace' => fake()->city(),
            'created_by' => User::where('role_id', 1)->inRandomOrder()->first()?->id ?? Str::uuid(),
            'updated_by' => User::where('role_id', 1)->inRandomOrder()->first()?->id ?? Str::uuid(),
        ];
    }
}
