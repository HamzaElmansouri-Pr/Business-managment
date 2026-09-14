<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => ucwords(fake()->words(3, true)),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-????')),
            'price' => fake()->randomFloat(2, 10, 1000),
            'type' => fake()->randomElement(['product', 'service']),
            'stock' => fake()->numberBetween(0, 100),
            'is_active' => fake()->boolean(90),
        ];
    }
}
