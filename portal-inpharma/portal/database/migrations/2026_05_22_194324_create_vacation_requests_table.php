<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vacation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('business_days');
            $table->text('reason')->nullable();
            $table->string('status')->index();
            $table->foreignId('approver_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('manager_decided_at')->nullable();
            $table->foreignId('approver_hr_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('hr_decided_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacation_requests');
    }
};
