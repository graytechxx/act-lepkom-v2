<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pastebin;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PastebinController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Admin/Pastebins/Index', [
            'pastebins' => $request->user()->pastebins()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'language' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['code'] = Str::random(10);

        Pastebin::create($validated);

        return redirect()->back()->with('success', 'Pastebin berhasil dibuat');
    }

    public function update(Request $request, Pastebin $pastebin)
    {
        if ($pastebin->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'language' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        $pastebin->update($validated);

        return redirect()->back()->with('success', 'Pastebin berhasil diperbarui');
    }

    public function destroy(Pastebin $pastebin)
    {
        if ($pastebin->user_id !== auth()->id()) {
            abort(403);
        }

        $pastebin->delete();
        return redirect()->back()->with('success', 'Pastebin berhasil dihapus');
    }

    // Public: view by code
    public function show($code)
    {
        $pastebin = Pastebin::where('code', $code)
            ->where('is_public', true)
            ->with('user')
            ->firstOrFail();

        return inertia('Public/Pastebin', [
            'pastebin' => $pastebin,
        ]);
    }
}
