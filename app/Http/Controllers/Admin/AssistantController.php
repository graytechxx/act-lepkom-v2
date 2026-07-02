<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AssistantController extends Controller
{
    /**
     * Authorize that only superadmins can manage assistant accounts.
     */
    protected function authorizeSuperAdmin()
    {
        if (auth()->user()->role !== User::ROLE_SUPERADMIN) {
            abort(403, 'Hanya Super Admin yang diizinkan untuk mengelola akun asisten.');
        }
    }

    public function index()
    {
        $this->authorizeSuperAdmin();

        return inertia('Admin/Assistants/Index', [
            'assistants' => User::whereIn('role', [User::ROLE_ASISTEN, User::ROLE_STAFF])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeSuperAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:asisten,staff',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'Akun asisten berhasil dibuat.');
    }

    public function update(Request $request, User $assistant)
    {
        $this->authorizeSuperAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email,' . $assistant->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:asisten,staff',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $assistant->update($updateData);

        return redirect()->back()->with('success', 'Akun asisten berhasil diperbarui.');
    }

    public function destroy(User $assistant)
    {
        $this->authorizeSuperAdmin();

        // Prevent self-deletion if they somehow target themselves
        if ($assistant->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $assistant->delete();

        return redirect()->back()->with('success', 'Akun asisten berhasil dihapus.');
    }
}
