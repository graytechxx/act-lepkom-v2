<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['level_id', 'name', 'description'];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
