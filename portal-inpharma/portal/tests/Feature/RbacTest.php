<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_colaborador_cannot_access_rh_area(): void
    {
        $role = Role::create(['name' => 'colaborador']);
        $user = User::factory()->create()->assignRole($role);

        $this->actingAs($user)->get('/rh')->assertStatus(403);
    }

    public function test_rh_can_access_rh_area(): void
    {
        $role = Role::create(['name' => 'rh']);
        $user = User::factory()->create()->assignRole($role);

        $this->actingAs($user)->get('/rh')->assertStatus(200);
    }
}

