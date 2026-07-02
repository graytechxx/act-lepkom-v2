<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserPreference;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'nullable|string|in:dark,light',
            'notifications' => 'nullable|json',
            'sidebar_collapsed' => 'nullable|string|in:true,false',
        ]);

        $pref = UserPreference::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json($pref);
    }
}
