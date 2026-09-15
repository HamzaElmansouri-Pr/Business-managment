<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_orders()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/orders');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_can_create_order_with_total_calculation()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $customer = Customer::create(['name' => 'John', 'email' => 'j@example.com']);
        $product1 = Product::create(['name' => 'P1', 'sku' => 'P1', 'price' => 10.00, 'type' => 'product', 'stock' => 10]);
        $product2 = Product::create(['name' => 'P2', 'sku' => 'P2', 'price' => 20.00, 'type' => 'product', 'stock' => 10]);

        $payload = [
            'customer_id' => $customer->id,
            'items' => [
                ['product_id' => $product1->id, 'quantity' => 2],
                ['product_id' => $product2->id, 'quantity' => 3],
            ],
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.total', '80.00');

        $this->assertDatabaseHas('orders', ['customer_id' => $customer->id, 'total' => 80]);
        $this->assertDatabaseHas('order_items', ['product_id' => $product1->id, 'quantity' => 2]);
    }

    public function test_staff_cannot_delete_order()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $user->assignRole('staff');

        $customer = Customer::create(['name' => 'John', 'email' => 'j2@example.com']);
        $order = Order::create(['customer_id' => $customer->id, 'status' => 'pending', 'total' => 0]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/v1/orders/{$order->id}");

        $response->assertStatus(403);
    }
}
