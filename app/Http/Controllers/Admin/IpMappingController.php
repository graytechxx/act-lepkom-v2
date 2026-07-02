<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IpMapping;
use Illuminate\Http\Request;

class IpMappingController extends Controller
{
    public function index()
    {
        return inertia('Admin/IpMappings/Index', [
            'mappings' => IpMapping::orderBy('ip_address')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ip_address' => 'required|string|max:45|unique:ip_mappings,ip_address',
            'room_name' => 'required|string|max:100',
        ]);

        IpMapping::create($validated);

        return redirect()->back()->with('success', 'Mapping IP berhasil ditambahkan');
    }

    public function update(Request $request, IpMapping $ipMapping)
    {
        $validated = $request->validate([
            'ip_address' => 'required|string|max:45|unique:ip_mappings,ip_address,' . $ipMapping->id,
            'room_name' => 'required|string|max:100',
        ]);

        $ipMapping->update($validated);

        return redirect()->back()->with('success', 'Mapping IP berhasil diperbarui');
    }

    public function destroy(IpMapping $ipMapping)
    {
        $ipMapping->delete();
        return redirect()->back()->with('success', 'Mapping IP berhasil dihapus');
    }

    // Check room by IP
    public function check(Request $request)
    {
        $ip = $request->ip() ?? $request->input('ip');
        $mapping = IpMapping::where('ip_address', $ip)->first();

        return response()->json([
            'room' => $mapping?->room_name,
            'detected' => $mapping !== null,
        ]);
    }
}
