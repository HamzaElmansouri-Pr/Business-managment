<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function view(User $user, Order $order): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function update(User $user, Order $order): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }
}
