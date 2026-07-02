<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin001',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_SUPERADMIN,
        ]);

        // Staff
        User::create([
            'name' => 'Staff Lepkom J5',
            'email' => 'staff001',
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

        foreach ($asistens as $index => $name) {
            $num = str_pad($index + 1, 3, '0', STR_PAD_LEFT);
            User::create([
                'name' => $name,
                'email' => "ast{$num}",
                'password' => Hash::make('password123'),
                'role' => User::ROLE_ASISTEN,
            ]);
        }
    }
}
