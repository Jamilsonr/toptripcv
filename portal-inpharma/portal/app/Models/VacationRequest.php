<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'employee_id',
    'start_date',
    'end_date',
    'business_days',
    'reason',
    'status',
    'approver_manager_id',
    'manager_decided_at',
    'approver_hr_id',
    'hr_decided_at',
    'rejection_reason',
    'submitted_at',
    'cancelled_at',
])]
class VacationRequest extends Model
{
    /** @use HasFactory<\Database\Factories\VacationRequestFactory> */
    use HasFactory;

    public const STATUS_PENDING_MANAGER = 'pending_manager';
    public const STATUS_PENDING_RH = 'pending_rh';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'manager_decided_at' => 'datetime',
            'hr_decided_at' => 'datetime',
            'submitted_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approverManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_manager_id');
    }

    public function approverHr(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_hr_id');
    }
}
