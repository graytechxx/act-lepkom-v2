<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rule;
use Illuminate\Http\Request;

class RuleController extends Controller
{
    public function index()
    {
        return inertia('Admin/Rules/Index', [
            'rules' => Rule::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'order' => 'nullable|integer|min:0',
        ]);

        Rule::create($validated);

        return redirect()->back()->with('success', 'Tata tertib berhasil ditambahkan');
    }

    public function update(Request $request, Rule $rule)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'order' => 'nullable|integer|min:0',
        ]);

        $rule->update($validated);

        return redirect()->back()->with('success', 'Tata tertib berhasil diperbarui');
    }

    public function destroy(Rule $rule)
    {
        $rule->delete();
        return redirect()->back()->with('success', 'Tata tertib berhasil dihapus');
    }

    // Public
    public function public()
    {
        return Rule::orderBy('order')->get();
    }
}
