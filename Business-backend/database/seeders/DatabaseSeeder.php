<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole($role);

        $customers = \App\Models\Customer::factory(25)->create();
        $products = \App\Models\Product::factory(15)->create();

        foreach ($customers->random(15) as $customer) {
            $orders = \App\Models\Order::factory(rand(1, 3))->create([
                'customer_id' => $customer->id,
            ]);

            foreach ($orders as $order) {
                $itemsCount = rand(1, 4);
                $items = collect();
                for ($i = 0; $i < $itemsCount; $i++) {
                    $items->push(\App\Models\OrderItem::factory()->create([
                        'order_id' => $order->id,
                        'product_id' => $products->random()->id,
                    ]));
                }
                
                $total = $items->sum(fn ($item) => $item->quantity * $item->unit_price);
                $order->update(['total' => $total]);
            }
        }
    }
}
