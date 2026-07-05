<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'active_room',
        'is_pj',
        'last_seen_at',
        'must_change_password',
        'tag',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_pj' => 'boolean',
            'last_seen_at' => 'datetime',
            'must_change_password' => 'boolean',
        ];
    }

    // Roles
    const ROLE_SUPERADMIN = 'superadmin';
    const ROLE_STAFF = 'staff';
    const ROLE_ASISTEN = 'asisten';

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN || $this->tag === 'TEKNIS';
    }

    public function isStaff(): bool
    {
        return $this->role === self::ROLE_STAFF;
    }

    public function isAsisten(): bool
    {
        return $this->role === self::ROLE_ASISTEN;
    }

    // Relations
    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'created_by');
    }

    public function calEvents()
    {
        return $this->hasMany(CalEvent::class, 'created_by');
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'uploaded_by');
    }

    public function privateNotes()
    {
        return $this->hasMany(PrivateNote::class);
    }

    public function pastebins()
    {
        return $this->hasMany(Pastebin::class);
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function preference()
    {
        return $this->hasOne(UserPreference::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
