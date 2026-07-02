<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Admin/Uploads/Index', [
            'uploads' => Upload::with(['user', 'level', 'course'])->latest()->get(),
            'levels' => \App\Models\Level::with('courses')->orderBy('order')->get(),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200',
            'level_id' => 'nullable|exists:levels,id',
            'course_id' => 'nullable|exists:courses,id',
            'room_name' => 'nullable|string|max:100',
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads');

        Upload::create([
            'user_id' => $request->user()->id,
            'level_id' => $request->level_id,
            'course_id' => $request->course_id,
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'room_name' => $request->room_name,
        ]);

        return redirect()->back()->with('success', 'Upload berhasil');
    }

    public function publicUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200',
            'student_name' => 'required|string|max:255',
            'student_npm' => 'required|string|max:50',
            'level_id' => 'required|exists:levels,id',
            'course_id' => 'required|exists:courses,id',
            'room_name' => 'nullable|string|max:100',
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads');

        Upload::create([
            'user_id' => null,
            'student_name' => $request->student_name,
            'student_npm' => $request->student_npm,
            'level_id' => $request->level_id,
            'course_id' => $request->course_id,
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'room_name' => $request->room_name,
        ]);

        return redirect()->back()->with('success', 'Tugas Anda berhasil diunggah!');
    }

    public function destroy(Upload $upload)
    {
        if (Storage::exists($upload->stored_path)) {
            Storage::delete($upload->stored_path);
        }

        $upload->delete();
        return redirect()->back()->with('success', 'Upload berhasil dihapus');
    }

    public function download(Upload $upload)
    {
        if (!Storage::exists($upload->stored_path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan');
        }

        return Storage::download($upload->stored_path, $upload->original_name);
    }

    // Check upload check (for verification)
    public function checkUpload(Request $request)
    {
        $room = $request->input('room');
        $levelId = $request->input('level_id');
        $courseId = $request->input('course_id');

        $query = Upload::with('user');

        if ($room) $query->where('room_name', $room);
        if ($levelId) $query->where('level_id', $levelId);
        if ($courseId) $query->where('course_id', $courseId);

        return $query->latest()->get();
    }
}
