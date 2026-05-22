<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndDemoUsersSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $colaborador = Role::firstOrCreate(['name' => 'colaborador']);
        $gestor = Role::firstOrCreate(['name' => 'gestor']);
        $rh = Role::firstOrCreate(['name' => 'rh']);

        $rhUser = User::factory()
            ->create([
                'name' => 'RH Demo',
                'email' => 'rh@inpharma.local',
            ])
            ->assignRole($rh);

        Employee::create([
            'user_id' => $rhUser->id,
            'vacation_days_available' => 22,
        ]);

        $gestorUser = User::factory()
            ->create([
                'name' => 'Gestor Demo',
                'email' => 'gestor@inpharma.local',
            ])
            ->assignRole($gestor);

        Employee::create([
            'user_id' => $gestorUser->id,
            'vacation_days_available' => 22,
        ]);

        $colaboradorUser = User::factory()
            ->create([
                'name' => 'Colaborador Demo',
                'email' => 'colaborador@inpharma.local',
            ])
            ->assignRole($colaborador);

        Employee::create([
            'user_id' => $colaboradorUser->id,
            'manager_id' => $gestorUser->id,
            'vacation_days_available' => 22,
        ]);
    }
}
