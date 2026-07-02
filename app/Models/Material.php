<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'level_id', 'course_id', 'name', 'type', 'path', 'mime_type', 'size', 'uploaded_by'
    ];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
