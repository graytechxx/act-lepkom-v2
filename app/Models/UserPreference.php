<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['user_id', 'theme', 'notifications', 'sidebar_collapsed'];

    protected function casts(): array
    {
        return [
            'notifications' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
