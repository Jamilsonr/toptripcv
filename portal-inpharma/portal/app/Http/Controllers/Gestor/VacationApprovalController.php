<?php

namespace App\Http\Controllers\Gestor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VacationRequest;
use App\Notifications\VacationRequestStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VacationApprovalController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = VacationRequest::query()
            ->where('status', VacationRequest::STATUS_PENDING_MANAGER)
            ->whereHas('employee', fn ($q) => $q->where('manager_id', $request->user()->id))
            ->with(['employee.user'])
            ->latest()
            ->get()
            ->map(fn (VacationRequest $r) => [
                'id' => $r->id,
                'employee_name' => $r->employee->user->name,
                'start_date' => $r->start_date?->toDateString(),
                'end_date' => $r->end_date?->toDateString(),
                'business_days' => $r->business_days,
                'reason' => $r->reason,
            ]);

        return Inertia::render('Gestor/VacationApprovals', [
            'requests' => $requests,
        ]);
    }

    public function approve(Request $request, VacationRequest $vacationRequest): RedirectResponse
    {
        $this->assertCanDecide($request, $vacationRequest);

        $vacationRequest->update([
            'status' => VacationRequest::STATUS_PENDING_RH,
            'approver_manager_id' => $request->user()->id,
            'manager_decided_at' => now(),
            'rejection_reason' => null,
        ]);

        $vacationRequest->employee->user->notify(new VacationRequestStatusNotification(
            $vacationRequest->id,
            $vacationRequest->status,
        ));

        User::role('rh')->each(fn (User $u) => $u->notify(new VacationRequestStatusNotification(
            $vacationRequest->id,
            $vacationRequest->status,
        )));

        return redirect()->route('gestor.vacations.approvals');
    }

    public function reject(Request $request, VacationRequest $vacationRequest): RedirectResponse
    {
        $this->assertCanDecide($request, $vacationRequest);

        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:2000'],
        ]);

        $vacationRequest->update([
            'status' => VacationRequest::STATUS_REJECTED,
            'approver_manager_id' => $request->user()->id,
            'manager_decided_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
        ]);

        $vacationRequest->employee->user->notify(new VacationRequestStatusNotification(
            $vacationRequest->id,
            $vacationRequest->status,
            ['rejection_reason' => $vacationRequest->rejection_reason],
        ));

        return redirect()->route('gestor.vacations.approvals');
    }

    private function assertCanDecide(Request $request, VacationRequest $vacationRequest): void
    {
        if ($vacationRequest->status !== VacationRequest::STATUS_PENDING_MANAGER) {
            abort(403);
        }

        $managerId = $vacationRequest->employee?->manager_id;
        if (!$managerId || $managerId !== $request->user()->id) {
            abort(403);
        }
    }
}
