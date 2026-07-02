<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index()
    {
        return inertia('Admin/Levels/Index', [
            'levels' => Level::orderBy('order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'order' => 'nullable|integer|min:0',
        ]);

        Level::create($validated);

        return redirect()->back()->with('success', 'Tingkat berhasil ditambahkan');
    }

    public function update(Request $request, Level $level)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'order' => 'nullable|integer|min:0',
        ]);

        $level->update($validated);

        return redirect()->back()->with('success', 'Tingkat berhasil diperbarui');
    }

    public function destroy(Level $level)
    {
        $level->delete();
        return redirect()->back()->with('success', 'Tingkat berhasil dihapus');
    }
}
