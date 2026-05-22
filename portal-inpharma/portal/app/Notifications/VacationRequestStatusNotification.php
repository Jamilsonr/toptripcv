<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VacationRequestStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        public int $vacationRequestId,
        public string $status,
        public array $payload = [],
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'vacation_request_id' => $this->vacationRequestId,
            'status' => $this->status,
            ...$this->payload,
        ];
    }
}
