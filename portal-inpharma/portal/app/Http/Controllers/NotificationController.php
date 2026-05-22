<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->take(50)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => class_basename($n->type),
                'data' => $n->data,
                'read_at' => $n->read_at?->toDateTimeString(),
                'created_at' => $n->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $notificationId): RedirectResponse
    {
        $notification = $request->user()->notifications()->whereKey($notificationId)->firstOrFail();
        $notification->markAsRead();

        return redirect()->route('notifications.index');
    }
}
