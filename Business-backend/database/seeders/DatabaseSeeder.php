<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

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

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);

        $user->assignRole($adminRole);

        $manager = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@opsly.test',
        ]);
        $manager->assignRole($managerRole);

        $staff = User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@opsly.test',
        ]);
        $staff->assignRole($staffRole);

        $customers = Customer::factory(25)->create();
        $products = Product::factory(15)->create();

        foreach ($customers->random(15) as $customer) {
            $orders = Order::factory(rand(1, 3))->create([
                'customer_id' => $customer->id,
            ]);

            foreach ($orders as $order) {
                $itemsCount = rand(1, 4);
                $items = collect();
                for ($i = 0; $i < $itemsCount; $i++) {
                    $items->push(OrderItem::factory()->create([
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
