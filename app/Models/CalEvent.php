<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalEvent extends Model
{
    protected $fillable = ['title', 'description', 'start', 'end', 'color', 'is_public', 'created_by'];

    protected function casts(): array
    {
        return [
            'start' => 'datetime',
            'end' => 'datetime',
            'is_public' => 'boolean',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
