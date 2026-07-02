<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Admin/Attendance/Index', [
            'attendances' => Attendance::with(['assistant', 'recorder', 'course'])
                ->latest()
                ->take(100)
                ->get(),
            'assistants' => User::where('role', User::ROLE_ASISTEN)->orderBy('name')->get(['id', 'name']),
            'courses' => Course::with('level')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'assistant_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'room' => 'required|string|max:50',
            'session' => 'required|string|max:50',
            'course_id' => 'nullable|exists:courses,id',
            'notes' => 'nullable|string',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        Attendance::create($validated);

        return redirect()->back()->with('success', 'Absensi berhasil dicatat');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->back()->with('success', 'Absensi berhasil dihapus');
    }

    // By date range
    public function byDate(Request $request)
    {
        return Attendance::with(['assistant', 'recorder', 'course'])
            ->when($request->from, fn($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($request->to, fn($q, $v) => $q->whereDate('date', '<=', $v))
            ->latest()
            ->get();
    }
}
