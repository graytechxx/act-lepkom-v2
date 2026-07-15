<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Active check-in session for the current user
        $activeSession = AttendanceLog::where('user_id', $user->id)
            ->whereNull('check_out')
            ->first();

        // History logs
        if (in_array($user->role, ['superadmin', 'staff'])) {
            $history = AttendanceLog::with('user')->orderBy('id', 'desc')->take(50)->get();
        } else {
            $history = AttendanceLog::where('user_id', $user->id)->orderBy('id', 'desc')->take(20)->get();
        }

        return inertia('Admin/Attendance/Index', [
            'activeSession' => $activeSession,
            'history' => $history,
            'scriptUrl' => env('GOOGLE_APPS_SCRIPT_URL', ''),
        ]);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:STANDBY J5,TAWK.TO (ONLINE),MAINTENANCE',
        ]);

        $user = auth()->user();

        // Prevent duplicate active session
        $existing = AttendanceLog::where('user_id', $user->id)
            ->whereNull('check_out')
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Anda sudah melakukan check-in.');
        }

        AttendanceLog::create([
            'user_id' => $user->id,
            'date' => now()->format('Y-m-d'),
            'type' => $request->type,
            'check_in' => now()->format('H:i'),
        ]);

        return redirect()->back()->with('success', 'Berhasil check-in jaga.');
    }

    public function checkOut(Request $request)
    {
        $user = auth()->user();

        $session = AttendanceLog::where('user_id', $user->id)
            ->whereNull('check_out')
            ->first();

        if (!$session) {
            return redirect()->back()->with('error', 'Sesi check-in tidak ditemukan.');
        }

        $session->check_out = now()->format('H:i');
        $session->description = $request->description;
        $session->save();

        // Sync to Google Sheets
        $this->syncToGoogleSheets($session);

        return redirect()->back()->with('success', 'Berhasil check-out jaga.');
    }

    private function syncToGoogleSheets(AttendanceLog $log)
    {
        $scriptUrl = env('GOOGLE_APPS_SCRIPT_URL');
        if (!$scriptUrl) {
            $log->sync_status = 'failed';
            $log->sync_error = 'Google Apps Script URL is not configured in .env';
            $log->save();
            return;
        }

        // Format Indonesian Date: "Senin, 5 Januari 2026"
        $formattedDate = self::formatIndonesianDate($log->date);

        // Keterangan jaga
        $keterangan = $log->type;
        if ($log->type === 'MAINTENANCE' && $log->description) {
            $keterangan = "Maintenance (" . $log->description . ")";
        } elseif ($log->type === 'TAWK.TO (ONLINE)') {
            $keterangan = "tawkTo";
        } elseif ($log->type === 'STANDBY J5') {
            $keterangan = "Teknis Standby J5";
        }

        try {
            $response = Http::timeout(10)->post($scriptUrl, [
                'nama' => $log->user->name,
                'tanggal' => $formattedDate,
                'masuk' => str_replace(':', '.', $log->check_in),
                'keluar' => str_replace(':', '.', $log->check_out),
                'keterangan' => $keterangan,
            ]);

            if ($response->successful() && isset($response->json()['status']) && $response->json()['status'] === 'success') {
                $log->sync_status = 'synced';
                $log->sync_error = null;
            } else {
                $log->sync_status = 'failed';
                $log->sync_error = $response->body() ?: 'Unknown response error';
            }
        } catch (\Exception $e) {
            $log->sync_status = 'failed';
            $log->sync_error = $e->getMessage();
        }

        $log->save();
    }

    public static function formatIndonesianDate($dateStr)
    {
        $days = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu'
        ];
        $months = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        $timestamp = strtotime($dateStr);
        $dayName = $days[date('l', $timestamp)];
        $dayNum = date('j', $timestamp);
        $monthName = $months[(int)date('n', $timestamp)];
        $year = date('Y', $timestamp);

        return "$dayName, $dayNum $monthName $year";
    }
}
