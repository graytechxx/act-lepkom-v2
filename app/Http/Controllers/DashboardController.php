<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Announcement;
use App\Models\CalEvent;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Automatically detect laboratory room from request IP address
        $ip = $request->ip();
        $mapping = \App\Models\IpMapping::where('ip_address', $ip)->first();
        $room = $mapping?->room_name;

        $user->update([
            'last_seen_at' => now(),
            'active_room' => $room,
        ]);

        $onlineAssistants = \App\Models\User::whereIn('role', ['asisten', 'staff'])
            ->where('last_seen_at', '>=', now()->subMinutes(10))
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'active_room', 'is_pj', 'last_seen_at']);

        $stats = [
            'userCount' => \App\Models\User::count(),
            'asistenCount' => \App\Models\User::where('role', 'asisten')->count(),
            'levelCount' => Level::count(),
            'materialCount' => \App\Models\Material::count(),
            'announcementCount' => Announcement::count(),
            'onlineAssistants' => $onlineAssistants,
            'recentAnnouncements' => Announcement::where('is_published', true)
                ->with('creator')
                ->latest()
                ->take(5)
                ->get(),
            'upcomingEvents' => CalEvent::where('is_public', true)
                ->where('start', '>=', now())
                ->orderBy('start')
                ->take(5)
                ->get(),
        ];

        return inertia('Admin/Dashboard', $stats);
    }

    public function togglePj(Request $request)
    {
        $user = $request->user();
        $user->update([
            'is_pj' => !$user->is_pj
        ]);

        return redirect()->back()->with('success', 'Status PJ ruangan Anda berhasil diubah.');
    }
}
