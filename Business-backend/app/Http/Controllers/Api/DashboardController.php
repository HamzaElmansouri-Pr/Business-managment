<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $revenue = Order::where('status', 'completed')->sum('total');
        $ordersCount = Order::count();
        $customersCount = Customer::count();

        $completedOrdersCount = Order::where('status', 'completed')->count();
        $avgOrderValue = $completedOrdersCount > 0 ? $revenue / $completedOrdersCount : 0;

        $recentOrders = Order::with('customer')
            ->latest()
            ->take(5)
            ->get();

        $data = [
            'revenue' => (float) $revenue,
            'orders_count' => $ordersCount,
            'customers_count' => $customersCount,
            'avg_order_value' => (float) $avgOrderValue,
            'recent_orders' => $recentOrders,
        ];

        return response()->json($data);
    }
}
