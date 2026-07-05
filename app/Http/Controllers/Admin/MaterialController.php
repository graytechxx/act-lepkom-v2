<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Level;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    protected function checkAuthorization()
    {
        $user = auth()->user();
        if ($user && $user->role === 'asisten' && empty($user->tag)) {
            abort(403, 'Asisten tanpa tag tidak diperbolehkan mengakses fitur Materi & Modul.');
        }
    }

    public function index()
    {
        $this->checkAuthorization();

        return inertia('Admin/Materials/Index', [
            'materials' => Material::with(['level', 'course', 'uploader'])->latest()->get(),
            'levels' => Level::with('courses')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAuthorization();

        $validated = $request->validate([
            'level_id' => 'nullable|exists:levels,id',
            'course_id' => 'nullable|exists:courses,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:file,folder,link',
            'path' => 'required|string|max:500',
            'mime_type' => 'nullable|string|max:100',
            'size' => 'nullable|integer',
            'meeting_number' => 'nullable|integer|min:1|max:8',
        ]);

        $validated['uploaded_by'] = $request->user()->id;

        Material::create($validated);

        return redirect()->back()->with('success', 'Materi berhasil ditambahkan');
    }

    public function upload(Request $request)
    {
        $this->checkAuthorization();

        $request->validate([
            'file' => 'required|file|max:51200', // 50MB max
            'level_id' => 'nullable|exists:levels,id',
            'course_id' => 'nullable|exists:courses,id',
            'meeting_number' => 'nullable|integer|min:1|max:8',
        ]);

        $file = $request->file('file');
        $path = $file->store('materials');

        Material::create([
            'level_id' => $request->level_id,
            'course_id' => $request->course_id,
            'name' => $file->getClientOriginalName(),
            'type' => 'file',
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $request->user()->id,
            'meeting_number' => $request->meeting_number,
        ]);

        return redirect()->back()->with('success', 'File berhasil diupload');
    }

    public function destroy(Material $material)
    {
        $this->checkAuthorization();

        if ($material->type === 'file' && Storage::exists($material->path)) {
            Storage::delete($material->path);
        }

        $material->delete();

        return redirect()->back()->with('success', 'Materi berhasil dihapus');
    }

    public function download(Material $material)
    {
        $this->checkAuthorization();

        if ($material->type !== 'file' || !Storage::exists($material->path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan');
        }

        if (request()->query('inline') === 'true') {
            return Storage::response($material->path, $material->name, [
                'Content-Type' => $material->mime_type ?? 'application/octet-stream',
            ]);
        }

        return Storage::download($material->path, $material->name);
    }

    // Public: materials by level/course
    public function publicIndex(Request $request)
    {
        return Material::with(['level', 'course', 'uploader'])
            ->when($request->level_id, fn($q, $v) => $q->where('level_id', $v))
            ->when($request->course_id, fn($q, $v) => $q->where('course_id', $v))
            ->latest()
            ->get();
    }
}
