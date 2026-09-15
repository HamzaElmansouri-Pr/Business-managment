<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return UserResource::collection($query->paginate());
    }

    public function store(StoreUserRequest $request)
    {
        // Generate a temporary password since this is a demo app (as requested).
        // In production, we might send an email invitation.
        $temporaryPassword = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($temporaryPassword),
        ]);

        $user->assignRole($request->role);

        return (new UserResource($user))->additional([
            'meta' => [
                'temporary_password' => $temporaryPassword,
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->only(['name', 'email']));

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        abort_if($user->id === auth()->id(), 422, 'Cannot delete yourself');

        $user->delete();

        return response()->noContent();
    }
}
