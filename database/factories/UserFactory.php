<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => fake()->name(),
            'username' => $this->faker->unique()->userName,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role_id' => $this->faker->numberBetween(1, 3),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
    public function superAdmin()
    {
        return $this->state([
            'role_id' => 1,
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'superadmin@example.com'
        ]);
    }
    public function admin()
    {
        return $this->state([
            'role_id' => 2,
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@example.com'
        ]);
    }
}
