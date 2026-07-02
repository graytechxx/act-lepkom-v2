<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = ['Tingkat 1', 'Tingkat 2', 'Tingkat 3'];
        foreach ($levels as $i => $name) {
            Level::create(['name' => $name, 'order' => $i + 1]);
        }
    }
}
