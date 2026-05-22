<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\VacationRequest;
use App\Services\BusinessDayCalculator;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VacationRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $employee = $request->user()?->employee;

        $requests = VacationRequest::query()
            ->when(
                $employee,
                fn ($q) => $q->where('employee_id', $employee->id),
                fn ($q) => $q->whereRaw('1 = 0'),
            )
            ->latest()
            ->get()
            ->map(fn (VacationRequest $r) => [
                'id' => $r->id,
                'start_date' => $r->start_date?->toDateString(),
                'end_date' => $r->end_date?->toDateString(),
                'business_days' => $r->business_days,
                'status' => $r->status,
                'rejection_reason' => $r->rejection_reason,
                'submitted_at' => $r->submitted_at?->toDateTimeString(),
                'cancelled_at' => $r->cancelled_at?->toDateTimeString(),
            ]);

        return Inertia::render('Vacations/Index', [
            'vacationDaysAvailable' => $employee?->vacation_days_available ?? 0,
            'requests' => $requests,
        ]);
    }

    public function create(Request $request): Response
    {
        $employee = $request->user()?->employee;

        return Inertia::render('Vacations/Create', [
            'vacationDaysAvailable' => $employee?->vacation_days_available ?? 0,
        ]);
    }

    public function store(Request $request, BusinessDayCalculator $calculator): RedirectResponse
    {
        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:2000'],
        ]);

        $employee = Employee::firstOrCreate(['user_id' => $request->user()->id]);

        $start = CarbonImmutable::parse($data['start_date'])->startOfDay();
        $end = CarbonImmutable::parse($data['end_date'])->startOfDay();
        $businessDays = $calculator->countBusinessDays($start, $end);

        if ($businessDays <= 0) {
            return back()->withErrors([
                'start_date' => 'O intervalo selecionado não contém dias úteis.',
            ]);
        }

        if ($businessDays > $employee->vacation_days_available) {
            return back()->withErrors([
                'start_date' => 'Saldo de férias insuficiente para este pedido.',
            ]);
        }

        $status = $employee->manager_id
            ? VacationRequest::STATUS_PENDING_MANAGER
            : VacationRequest::STATUS_PENDING_RH;

        VacationRequest::create([
            'employee_id' => $employee->id,
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'business_days' => $businessDays,
            'reason' => $data['reason'] ?? null,
            'status' => $status,
            'submitted_at' => now(),
        ]);

        return redirect()->route('vacations.index');
    }

    public function cancel(Request $request, VacationRequest $vacationRequest): RedirectResponse
    {
        $employeeId = $request->user()?->employee?->id;

        if (!$employeeId || $vacationRequest->employee_id !== $employeeId) {
            abort(403);
        }

        if (!in_array($vacationRequest->status, [
            VacationRequest::STATUS_PENDING_MANAGER,
            VacationRequest::STATUS_PENDING_RH,
        ], true)) {
            abort(403);
        }

        $vacationRequest->update([
            'status' => VacationRequest::STATUS_CANCELLED,
            'cancelled_at' => now(),
        ]);

        return redirect()->route('vacations.index');
    }
}
