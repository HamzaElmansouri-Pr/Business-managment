<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Clear cache before each test
        Cache::flush();
    }

    public function test_dashboard_summary_returns_correct_metrics_and_shape()
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole($role);
        $this->actingAs($user);

        // Create some customers
        Customer::factory()->count(3)->create();

        // Create a completed order (should be in revenue)
        Order::factory()->create([
            'status' => 'completed',
            'total' => 150.00
        ]);
        
        // Create another completed order
        Order::factory()->create([
            'status' => 'completed',
            'total' => 50.00
        ]);

        // Create a pending order (should NOT be in revenue)
        Order::factory()->create([
            'status' => 'pending',
            'total' => 100.00
        ]);

        $response = $this->getJson('/api/v1/dashboard/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'revenue',
                'orders_count',
                'customers_count',
                'avg_order_value',
                'recent_orders' => [
                    '*' => ['id', 'status', 'total', 'customer']
                ]
            ]);

        $data = $response->json();

        // Revenue should only count 'completed' orders
        // 150 + 50 = 200
        $this->assertEquals(200.00, $data['revenue']);

        // Orders count is all orders
        $this->assertEquals(3, $data['orders_count']);

        // Customers count (3 explicitly created + 3 implicitly created by Order factory)
        $this->assertEquals(6, $data['customers_count']);

        // Avg order value = 200 / 2 = 100
        $this->assertEquals(100.00, $data['avg_order_value']);

        // Should return 3 recent orders (up to 5)
        $this->assertCount(3, $data['recent_orders']);
    }
}
