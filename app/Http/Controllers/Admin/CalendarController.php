<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalEvent;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index()
    {
        return inertia('Admin/Calendar/Index');
    }

    public function events()
    {
        return CalEvent::with('creator')->orderBy('start')->get()->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'start' => $event->start->format('Y-m-d H:i:s'),
                'end' => $event->end?->format('Y-m-d H:i:s'),
                'color' => $event->color,
                'description' => $event->description,
                'is_public' => $event->is_public,
                'creator' => $event->creator?->name,
            ];
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
            'color' => 'nullable|string|max:20',
            'is_public' => 'boolean',
        ]);

        $validated['created_by'] = $request->user()->id;

        CalEvent::create($validated);

        return redirect()->back()->with('success', 'Event berhasil ditambahkan');
    }

    public function update(Request $request, CalEvent $calEvent)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
            'color' => 'nullable|string|max:20',
            'is_public' => 'boolean',
        ]);

        $calEvent->update($validated);

        return redirect()->back()->with('success', 'Event berhasil diperbarui');
    }

    public function destroy(CalEvent $calEvent)
    {
        $calEvent->delete();
        return redirect()->back()->with('success', 'Event berhasil dihapus');
    }

    // Public events API
    public function publicEvents()
    {
        return CalEvent::where('is_public', true)->orderBy('start')->get()->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'start' => $event->start->format('Y-m-d H:i:s'),
                'end' => $event->end?->format('Y-m-d H:i:s'),
                'color' => $event->color,
                'description' => $event->description,
            ];
        });
    }
}
