<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        return inertia('Admin/Chat/Index', [
            'messages' => ChatMessage::with('user')->latest()->take(100)->get()->reverse()->values(),
        ]);
    }

    public function messages()
    {
        return ChatMessage::with('user')->latest()->take(50)->get()->reverse()->values();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $msg = ChatMessage::create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        return response()->json($msg->load('user'));
    }
}
