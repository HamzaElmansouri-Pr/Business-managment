<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'admin']);
    }

    public function test_changing_order_status_creates_notification()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::factory()->create();
        $product = Product::factory()->create(['price' => 100]);
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->patchJson("/api/v1/orders/{$order->id}", [
                'status' => 'completed',
            ])
            ->assertStatus(200);

        $this->assertDatabaseHas('notifications', [
            'notifiable_type' => User::class,
            'notifiable_id' => $admin->id,
        ]);

        $notification = DatabaseNotification::first();
        $this->assertEquals('completed', $notification->data['status']);
        $this->assertEquals('pending', $notification->data['old_status']);
        $this->assertEquals($order->id, $notification->data['order_id']);
    }

    public function test_fetching_and_reading_notifications()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $customer = Customer::factory()->create();
        $order = Order::factory()->create(['customer_id' => $customer->id, 'status' => 'pending']);

        // Trigger notification
        $this->actingAs($admin)->patchJson("/api/v1/orders/{$order->id}", ['status' => 'processing']);

        $response = $this->actingAs($admin)->getJson('/api/v1/notifications');
        $response->assertStatus(200)->assertJsonCount(1);
        
        $notificationId = $response->json('0.id');

        $this->actingAs($admin)
            ->patchJson("/api/v1/notifications/{$notificationId}/read")
            ->assertStatus(204);

        $response = $this->actingAs($admin)->getJson('/api/v1/notifications');
        $response->assertStatus(200)->assertJsonCount(0); // Only unread should be returned
    }
}
