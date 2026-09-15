<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        User::factory(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/users');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_non_admin_cannot_list_users()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $user->assignRole('staff');

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_user()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $payload = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'role' => 'manager',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'New User')
            ->assertJsonPath('data.role', 'manager');

        $this->assertArrayHasKey('temporary_password', $response->json('meta'));

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }

    public function test_admin_cannot_delete_themselves()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/v1/users/{$user->id}");

        $response->assertStatus(422);
    }

    public function test_admin_can_delete_other_user()
    {
        $user = User::factory()->create();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole('admin');

        $otherUser = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/v1/users/{$otherUser->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $otherUser->id]);
    }
}
