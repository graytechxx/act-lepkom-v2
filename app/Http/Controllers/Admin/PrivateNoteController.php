<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivateNote;
use Illuminate\Http\Request;

class PrivateNoteController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Admin/PrivateNotes/Index', [
            'notes' => $request->user()->privateNotes()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        PrivateNote::create($validated);

        return redirect()->back()->with('success', 'Catatan berhasil dibuat');
    }

    public function update(Request $request, PrivateNote $privateNote)
    {
        if ($privateNote->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $privateNote->update($validated);

        return redirect()->back()->with('success', 'Catatan berhasil diperbarui');
    }

    public function destroy(PrivateNote $privateNote)
    {
        if ($privateNote->user_id !== auth()->id()) {
            abort(403);
        }

        $privateNote->delete();
        return redirect()->back()->with('success', 'Catatan berhasil dihapus');
    }
}
