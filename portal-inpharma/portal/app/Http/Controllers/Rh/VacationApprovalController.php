<?php

namespace App\Http\Controllers\Rh;

use App\Http\Controllers\Controller;
use App\Models\VacationRequest;
use App\Notifications\VacationRequestStatusNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VacationApprovalController extends Controller
{
    public function index(): Response
    {
        $requests = VacationRequest::query()
            ->where('status', VacationRequest::STATUS_PENDING_RH)
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

        return Inertia::render('Rh/VacationApprovals', [
            'requests' => $requests,
        ]);
    }

    public function approve(Request $request, VacationRequest $vacationRequest): RedirectResponse
    {
        $this->assertCanDecide($vacationRequest);

        $employee = $vacationRequest->employee;
        if ($vacationRequest->business_days > $employee->vacation_days_available) {
            return back()->withErrors([
                'approval' => 'Saldo de férias insuficiente (atualizado) para aprovar este pedido.',
            ]);
        }

        $employee->update([
            'vacation_days_available' => $employee->vacation_days_available - $vacationRequest->business_days,
            'vacation_days_used' => $employee->vacation_days_used + $vacationRequest->business_days,
        ]);

        $vacationRequest->update([
            'status' => VacationRequest::STATUS_APPROVED,
            'approver_hr_id' => $request->user()->id,
            'hr_decided_at' => now(),
            'rejection_reason' => null,
        ]);

        $vacationRequest->employee->user->notify(new VacationRequestStatusNotification(
            $vacationRequest->id,
            $vacationRequest->status,
        ));

        return redirect()->route('rh.vacations.approvals');
    }

    public function reject(Request $request, VacationRequest $vacationRequest): RedirectResponse
    {
        $this->assertCanDecide($vacationRequest);

        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:2000'],
        ]);

        $vacationRequest->update([
            'status' => VacationRequest::STATUS_REJECTED,
            'approver_hr_id' => $request->user()->id,
            'hr_decided_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
        ]);

        $vacationRequest->employee->user->notify(new VacationRequestStatusNotification(
            $vacationRequest->id,
            $vacationRequest->status,
            ['rejection_reason' => $vacationRequest->rejection_reason],
        ));

        return redirect()->route('rh.vacations.approvals');
    }

    private function assertCanDecide(VacationRequest $vacationRequest): void
    {
        if ($vacationRequest->status !== VacationRequest::STATUS_PENDING_RH) {
            abort(403);
        }
    }
}
