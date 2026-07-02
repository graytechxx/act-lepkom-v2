<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\CalEvent;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'userCount' => \App\Models\User::count(),
            'asistenCount' => \App\Models\User::where('role', 'asisten')->count(),
            'levelCount' => Level::count(),
            'materialCount' => \App\Models\Material::count(),
            'announcementCount' => Announcement::count(),
            'myAttendance' => Attendance::where('assistant_id', $user->id)
                ->latest()
                ->take(10)
                ->with('course')
                ->get(),
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
}
