<?php

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

echo "Seeding rapid dashboard orders...\n";

// Create 5 "new" (pending) orders for the dashboard display
$recentCustomers = Customer::inRandomOrder()->take(5)->get();
foreach ($recentCustomers as $customer) {
    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'status' => 'pending',
        'created_at' => now(),
    ]);

    $product = Product::inRandomOrder()->first();
    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => rand(1, 3),
    ]);

    $order->update(['total' => $item->quantity * $item->unit_price]);
    echo "Created order #{$order->id} for customer {$customer->id}\n";
}
echo "Done!\n";

