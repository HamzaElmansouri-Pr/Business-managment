<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']); // guard_name to avoid issues
        $user->assignRole('admin');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_can_create_product()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $payload = [
            'name' => 'Test Product',
            'sku' => 'TEST-001',
            'price' => 10.50,
            'type' => 'product',
            'stock' => 50,
            'is_active' => true,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Test Product');

        $this->assertDatabaseHas('products', ['sku' => 'TEST-001']);
    }

    public function test_staff_cannot_delete_product()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $user->assignRole('staff');

        $product = Product::create([
            'name' => 'Test', 'sku' => 'T1', 'price' => 10, 'type' => 'product', 'stock' => 10,
        ]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/v1/products/{$product->id}");

        $response->assertStatus(403);
    }
}
