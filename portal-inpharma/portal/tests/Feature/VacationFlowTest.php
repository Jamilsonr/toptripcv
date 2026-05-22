<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use App\Models\VacationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class VacationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_vacation_request_approval_flow_deducts_balance(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Role::create(['name' => 'colaborador']);
        Role::create(['name' => 'gestor']);
        Role::create(['name' => 'rh']);

        $gestor = User::factory()->create()->assignRole('gestor');
        Employee::create(['user_id' => $gestor->id, 'vacation_days_available' => 22]);

        $rh = User::factory()->create()->assignRole('rh');
        Employee::create(['user_id' => $rh->id, 'vacation_days_available' => 22]);

        $colab = User::factory()->create()->assignRole('colaborador');
        $employee = Employee::create([
            'user_id' => $colab->id,
            'manager_id' => $gestor->id,
            'vacation_days_available' => 22,
        ]);

        $this->actingAs($colab)->post('/ferias', [
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-05',
        ])->assertRedirect('/ferias');

        $request = VacationRequest::query()->firstOrFail();
        $this->assertSame(VacationRequest::STATUS_PENDING_MANAGER, $request->status);
        $this->assertSame(5, $request->business_days);

        $this->actingAs($gestor)->post("/gestor/ferias/{$request->id}/aprovar")->assertRedirect('/gestor/ferias');
        $request->refresh();
        $this->assertSame(VacationRequest::STATUS_PENDING_RH, $request->status);

        $this->actingAs($rh)->post("/rh/ferias/{$request->id}/aprovar")->assertRedirect('/rh/ferias');
        $request->refresh();
        $this->assertSame(VacationRequest::STATUS_APPROVED, $request->status);

        $employee->refresh();
        $this->assertSame(17, $employee->vacation_days_available);
        $this->assertSame(5, $employee->vacation_days_used);
    }
}

