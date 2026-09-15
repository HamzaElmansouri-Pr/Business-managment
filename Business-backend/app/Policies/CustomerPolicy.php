<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function view(User $user, Customer $customer): bool
    {
        return $user->hasAnyRole(['admin', 'manager', 'staff']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    public function update(User $user, Customer $customer): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    public function delete(User $user, Customer $customer): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Customer $customer): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->hasRole('admin');
    }
}
