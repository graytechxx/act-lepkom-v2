<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Level;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return inertia('Admin/Courses/Index', [
            'courses' => Course::with('level')->orderBy('level_id')->get(),
            'levels' => Level::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level_id' => 'required|exists:levels,id',
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
        ]);

        Course::create($validated);

        return redirect()->back()->with('success', 'Kursus berhasil ditambahkan');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'level_id' => 'required|exists:levels,id',
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
        ]);

        $course->update($validated);

        return redirect()->back()->with('success', 'Kursus berhasil diperbarui');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->back()->with('success', 'Kursus berhasil dihapus');
    }
}
