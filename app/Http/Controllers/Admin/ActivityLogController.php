<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Admin/ActivityLogs/Index', [
            'logs' => ActivityLog::with('user')
                ->latest()
                ->take(200)
                ->get(),
        ]);
    }

    public function log($action, $entityType = null, $entityId = null, $description = null)
    {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'description' => $description,
            'ip_address' => request()->ip(),
        ]);
    }
}
