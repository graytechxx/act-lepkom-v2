<?php

use App\Http\Controllers\PublicController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\RuleController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\IpMappingController;
use App\Http\Controllers\Admin\MaterialController;
use App\Http\Controllers\Admin\PrivateNoteController;
use App\Http\Controllers\Admin\PastebinController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\ChatController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\UserPreferenceController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\AssistantController;
use Illuminate\Support\Facades\Route;

// ============ PUBLIC ROUTES ============
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/materi', [PublicController::class, 'materi'])->name('materi');
Route::get('/tata-tertib', [PublicController::class, 'tataTertib'])->name('tata-tertib');
Route::get('/login', [PublicController::class, 'login'])->name('login');
Route::post('/public/upload', [UploadController::class, 'publicUpload'])->name('public.upload');

// Public API
Route::get('/api/announcements', [AnnouncementController::class, 'public']);
Route::get('/api/rules', [RuleController::class, 'public']);
Route::get('/api/events', [CalendarController::class, 'publicEvents']);
Route::get('/api/materials', [MaterialController::class, 'publicIndex']);
Route::get('/p/{code}', [PastebinController::class, 'show'])->name('pastebin.show');

// ============ AUTHENTICATED ROUTES ============
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/admin/toggle-pj', [DashboardController::class, 'togglePj'])->name('admin.toggle-pj');

    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);

    // Preference
    Route::patch('/preferences', [UserPreferenceController::class, 'update']);

    // Levels (Master)
    Route::resource('/admin/levels', LevelController::class)->except(['show', 'create', 'edit']);

    // Assistants (CRUD)
    Route::resource('/admin/assistants', AssistantController::class)->except(['show', 'create', 'edit']);

    // Courses (Master)
    Route::resource('/admin/courses', CourseController::class)->except(['show', 'create', 'edit']);

    // Announcements (Master)
    Route::resource('/admin/announcements', AnnouncementController::class)->except(['show', 'create', 'edit']);

    // Rules (Master)
    Route::resource('/admin/rules', RuleController::class)->except(['show', 'create', 'edit']);

    // Calendar
    Route::get('/admin/calendar', [CalendarController::class, 'index'])->name('calendar');
    Route::get('/api/calendar/events', [CalendarController::class, 'events']);
    Route::resource('/admin/calendar', CalendarController::class)->except(['index', 'create', 'edit', 'show']);

    // IP Mappings
    Route::resource('/admin/ip-mappings', IpMappingController::class)->except(['show', 'create', 'edit']);
    Route::get('/api/ip-mapping', [IpMappingController::class, 'check']);

    // Materials
    Route::get('/admin/materials', [MaterialController::class, 'index'])->name('materials');
    Route::post('/admin/materials', [MaterialController::class, 'store']);
    Route::post('/admin/materials/upload', [MaterialController::class, 'upload'])->name('materials.upload');
    Route::delete('/admin/materials/{material}', [MaterialController::class, 'destroy']);
    Route::get('/admin/materials/{material}/download', [MaterialController::class, 'download'])->name('materials.download');

    // Private Notes
    Route::resource('/admin/notes', PrivateNoteController::class)->except(['show', 'create', 'edit']);

    // Pastebins
    Route::resource('/admin/pastebins', PastebinController::class)->except(['show', 'create', 'edit']);

    // Uploads
    Route::get('/admin/uploads', [UploadController::class, 'index'])->name('uploads');
    Route::post('/admin/uploads', [UploadController::class, 'upload'])->name('uploads.upload');
    Route::delete('/admin/uploads/{upload}', [UploadController::class, 'destroy']);
    Route::get('/admin/uploads/{upload}/download', [UploadController::class, 'download'])->name('uploads.download');

    // Chat
    Route::get('/admin/chat', [ChatController::class, 'index'])->name('chat');
    Route::get('/api/chat/messages', [ChatController::class, 'messages']);
    Route::post('/api/chat/messages', [ChatController::class, 'store']);

    // Activity Logs
    Route::get('/admin/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs');
});

require __DIR__.'/auth.php';
