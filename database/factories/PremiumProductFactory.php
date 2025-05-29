<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class PremiumProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private static int $laptopCounter = 1;

    public function definition(): array
    {
        $name = $this->generateLaptopName();
        $multiplier = $this->faker->numberBetween(40, 300);
        $price = $multiplier * 50000;

        return [
            'id' => strtolower(str_replace(' ', '', $name)),
            'name' => $this->generateLaptopName(),
            'price' => $price,
            'description' => $this->faker->sentence(10),
            'image_url' => 'https://res.cloudinary.com/dr79rpzsv/image/upload/v1731221029/laravel-sales/HP_Pavilion_x360_ce5xbm.jpg',
            'image_public_id' => 'v1731221029',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function generateLaptopName(): string
    {
        return 'Laptop Premium ' . self::$laptopCounter++;
    }

    public function withPrice(int $minPrice = 2000000, int $maxPrice = 10000000): static
    {
        $minMultiplier = ceil($minPrice / 50000);
        $maxMultiplier = floor($maxPrice / 50000);

        return $this->state(function () use ($minMultiplier, $maxMultiplier) {
            $multiplier = $this->faker->numberBetween($minMultiplier, $maxMultiplier);
            return [
                'price' => $multiplier * 50000,
            ];
        });
    }
    public function deleted(): static
    {
        return $this->state(fn() => [
            'deleted_at' => now(),
        ]);
    }

    public function restored(): static
    {
        return $this->state(fn() => [
            'restored_at' => now(),
            'deleted_at' => null,
        ]);
    }
}
