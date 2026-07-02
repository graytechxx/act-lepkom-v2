<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        return inertia('Admin/Announcements/Index', [
            'announcements' => Announcement::with('creator')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $validated['created_by'] = $request->user()->id;

        Announcement::create($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil dibuat');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $announcement->update($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus');
    }

    // Public: get published announcements
    public function public()
    {
        return Announcement::where('is_published', true)->latest()->get();
    }
}
