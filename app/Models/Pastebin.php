<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pastebin extends Model
{
    protected $fillable = ['user_id', 'title', 'code', 'content', 'language', 'is_public'];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
