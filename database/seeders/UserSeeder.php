<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin — same creds as original LMS
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@lms.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_SUPERADMIN,
        ]);

        // Staff
        User::create([
            'name' => 'Staff Lepkom J5',
            'email' => 'staff@lepkom-j5.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_STAFF,
        ]);

        // Sample asisten
        $asistens = [
            'Muhammad Khotami',
            'Raden Haikal Rizki Tri Hartanto',
            'Sulthan Farrel Fathurrahman',
            'Wahyu Alamsyah',
            'Daffa Taufiqulhafizh',
            'Muhammad Hatta Yudia Gymnastiar',
            'Mario Cristian Simatupang',
            'Arif Yanuar Pratama',
        ];

        foreach ($asistens as $name) {
            User::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@lepkom-j5.com',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_ASISTEN,
            ]);
        }
    }
}
