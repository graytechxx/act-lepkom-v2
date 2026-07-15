<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedule = Schedule::where('key', 'assistant_schedule')->first();
        return inertia('Admin/Schedules/Index', [
            'schedule' => $schedule ? $schedule->data : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'data' => 'required|array',
        ]);

        Schedule::updateOrCreate(
            ['key' => 'assistant_schedule'],
            ['data' => $validated['data']]
        );

        return redirect()->back()->with('success', 'Jadwal asisten berhasil diperbarui.');
    }

    public function destroy()
    {
        Schedule::where('key', 'assistant_schedule')->delete();

        return redirect()->back()->with('success', 'Jadwal asisten berhasil direset.');
    }
}
