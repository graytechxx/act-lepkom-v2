<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = ['key', 'data'];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }
}
