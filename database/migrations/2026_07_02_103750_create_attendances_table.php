<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assistant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->string('room', 50);
            $table->string('session', 50); // Sesi 0-4
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['assistant_id', 'date', 'room', 'session']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
