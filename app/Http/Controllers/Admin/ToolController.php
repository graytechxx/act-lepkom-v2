<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\File;
use ZipArchive;

class ToolController extends Controller
{
    /**
     * Render the Moodle Bulk Account Creator page.
     */
    public function moodleBulkUpload()
    {
        return inertia('Admin/Tools/MoodleBulkUpload');
    }

    /**
     * Render the Lepkom Excel Maker page.
     */
    public function excelMaker()
    {
        return inertia('Admin/Tools/ExcelMaker');
    }

    /**
     * Process master excel file upload and run python generator.
     */
    public function excelMakerGenerate(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // max 20MB
        ]);

        $uid = uniqid('em_', true);
        $tempPath = storage_path('app/excel-maker/' . $uid);

        $inputDir = $tempPath . '/input';
        $outputDir = $tempPath . '/output';

        if (!File::makeDirectory($inputDir, 0755, true, true)) {
            return response()->json([
                'success' => false,
                'logs' => "Error: Failed to create input directory.\n",
            ], 500);
        }

        if (!File::makeDirectory($outputDir, 0755, true, true)) {
            return response()->json([
                'success' => false,
                'logs' => "Error: Failed to create output directory.\n",
            ], 500);
        }

        // Save uploaded master file
        $file = $request->file('file');
        $uploadedPath = $file->move($inputDir, 'master.xlsx');

        // Python script info
        $pythonCmd = 'python';
        $scriptPath = 'C:/Users/anggi/lepkom-excel-maker/main.py';

        if (!File::exists($scriptPath)) {
            return response()->json([
                'success' => false,
                'logs' => "Error: Python script not found at {$scriptPath}\nPastikan script lepkom-excel-maker terinstall.",
            ], 400);
        }

        // Run process
        $process = Process::run([
            $pythonCmd,
            $scriptPath,
            $uploadedPath->getPathname(),
            $outputDir
        ]);

        $logs = $process->output() . "\n" . $process->errorOutput();
        $exitCode = $process->exitCode();

        if ($exitCode !== 0) {
            // Clean up files in temp path
            File::deleteDirectory($tempPath);

            return response()->json([
                'success' => false,
                'logs' => $logs . "\n[Process exited with code {$exitCode}]",
            ]);
        }

        // Zip output files
        $zipDir = $tempPath . '/zip';
        File::makeDirectory($zipDir, 0755, true, true);
        $zipFile = $zipDir . '/Generated_Spreadsheets.zip';

        $zip = new ZipArchive();
        $filesAdded = 0;

        if ($zip->open($zipFile, ZipArchive::CREATE) === true) {
            $files = File::files($outputDir);
            foreach ($files as $f) {
                $zip->addFile($f->getPathname(), $f->getFilename());
                $filesAdded++;
            }
            $zip->close();
        }

        if ($filesAdded === 0) {
            File::deleteDirectory($tempPath);
            return response()->json([
                'success' => false,
                'logs' => $logs . "\nError: Tidak ada file excel yang berhasil di-generate.",
            ]);
        }

        // Store zip info in session
        session()->put('excel_maker_zips.' . $uid, [
            'zip_path' => $zipFile,
            'filename' => 'Spreadsheets_Pengulangan_' . date('d-m-Y_H-i-s') . '.zip'
        ]);

        return response()->json([
            'success' => true,
            'logs' => $logs,
            'download_url' => route('admin.excel-maker.download', ['id' => $uid]),
        ]);
    }

    /**
     * Download generated ZIP file.
     */
    public function excelMakerDownload(Request $request)
    {
        $id = $request->query('id');
        $zipInfo = session()->get('excel_maker_zips.' . $id);

        if (!$zipInfo || !File::exists($zipInfo['zip_path'])) {
            abort(404, 'File ZIP hasil generate tidak ditemukan atau sudah kadaluarsa.');
        }

        return response()->download($zipInfo['zip_path'], $zipInfo['filename']);
    }
}
