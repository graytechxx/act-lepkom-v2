<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Ticket::with('user');

        if ($user->role === User::ROLE_SUPERADMIN) {
            // Superadmin can see all tickets
        } else {
            // Others see their own tickets, plus tickets targetted to their tag
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id);
                if ($user->tag === 'TEKNIS') {
                    $q->orWhere('target', 'TEKNIS');
                }
                if ($user->tag === 'ADMIN') {
                    $q->orWhere('target', 'ADMIN');
                }
            });
        }

        return inertia('Admin/Tickets/Index', [
            'tickets' => $query->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target' => 'required|string|in:TEKNIS,ADMIN',
        ]);

        Ticket::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'target' => $validated['target'],
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'Tiket keluhan berhasil dibuat.');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        $isAuthorized = ($user->role === User::ROLE_SUPERADMIN)
            || ($user->tag === 'TEKNIS' && $ticket->target === 'TEKNIS')
            || ($user->tag === 'ADMIN' && $ticket->target === 'ADMIN');

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki hak untuk memperbarui status tiket ini.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:open,progress,resolved',
        ]);

        $ticket->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Status tiket berhasil diperbarui.');
    }
}
