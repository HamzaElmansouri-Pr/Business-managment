<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }

    public function index(Request $request)
    {
        $query = Order::with('customer');

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        return OrderResource::collection($query->paginate());
    }

    public function store(StoreOrderRequest $request)
    {
        $order = Order::create([
            'customer_id' => $request->customer_id,
            'status' => $request->status ?? 'pending',
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $itemData) {
            $product = Product::find($itemData['product_id']);
            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $itemData['quantity'],
                'unit_price' => $product->price,
            ]);
        }

        $order->recalculateTotal();

        return new OrderResource($order->load(['customer', 'items.product']));
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load(['customer', 'items.product']));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->only(['status', 'notes']));

        return new OrderResource($order->load(['customer', 'items.product']));
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->noContent();
    }
}
