<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = ['name', 'order'];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }
}
