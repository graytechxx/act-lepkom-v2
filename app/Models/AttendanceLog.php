<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'type',
        'check_in',
        'check_out',
        'description',
        'sync_status',
        'sync_error',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
