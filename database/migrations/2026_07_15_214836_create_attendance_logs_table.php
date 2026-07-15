<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('type'); // 'STANDBY J5', 'TAWK.TO', 'MAINTENANCE'
            $table->string('check_in'); // e.g. "07:00"
            $table->string('check_out')->nullable(); // e.g. "17:00"
            $table->text('description')->nullable(); // For maintenance details
            $table->string('sync_status')->default('pending'); // 'pending', 'synced', 'failed'
            $table->text('sync_error')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
