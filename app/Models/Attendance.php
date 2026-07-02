<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'assistant_id', 'recorded_by', 'date', 'room', 'session',
        'course_id', 'notes'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function assistant()
    {
        return $this->belongsTo(User::class, 'assistant_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
