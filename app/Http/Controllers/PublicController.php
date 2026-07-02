<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Rule;
use App\Models\CalEvent;
use App\Models\Material;
use App\Models\Level;
use App\Models\Course;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        return inertia('Public/Home', [
            'announcements' => Announcement::where('is_published', true)
                ->with('creator')
                ->latest()
                ->take(5)
                ->get(),
            'levels' => Level::with('courses')->orderBy('order')->get(),
            'upcomingEvents' => CalEvent::where('is_public', true)
                ->where('start', '>=', now())
                ->orderBy('start')
                ->take(5)
                ->get(),
        ]);
    }

    public function materi(Request $request)
    {
        $levelId = $request->query('level');
        $courseId = $request->query('course');

        $query = Material::with(['level', 'course', 'uploader']);

        if ($levelId) $query->where('level_id', $levelId);
        if ($courseId) $query->where('course_id', $courseId);

        return inertia('Public/Materi', [
            'materials' => $query->latest()->get(),
            'levels' => Level::with('courses')->orderBy('order')->get(),
            'selectedLevel' => $levelId,
            'selectedCourse' => $courseId,
        ]);
    }

    public function tataTertib()
    {
        return inertia('Public/TataTertib', [
            'rules' => Rule::orderBy('order')->get(),
        ]);
    }

    public function login()
    {
        return inertia('Public/Login');
    }
}
