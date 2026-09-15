<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        // Return latest 15 unread notifications
        return response()->json(
            $request->user()->unreadNotifications()->latest()->take(15)->get()
        );
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->unreadNotifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->noContent();
    }
}
