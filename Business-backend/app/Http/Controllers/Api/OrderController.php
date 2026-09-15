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
        $oldStatus = $order->status;
        $order->update($request->only(['status', 'notes']));

        if ($request->has('status') && $oldStatus !== $order->status) {
            // Since Customer doesn't use the Notifiable trait by default,
            // we notify the acting user (Admin/Manager).
            $request->user()->notify(new \App\Notifications\OrderStatusUpdated($order, $oldStatus));
        }

        return new OrderResource($order->load(['customer', 'items.product']));
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->noContent();
    }
}
