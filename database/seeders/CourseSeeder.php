<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Level;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            1 => ['Web', 'Network', 'Desktop'],                      // Tingkat 1
            2 => ['Golang', 'Cisco', 'Java', 'Sql Server'],          // Tingkat 2
            3 => ['Golang', 'Cisco', 'Java', 'Oracle'],              // Tingkat 3
        ];

        foreach ($courses as $levelId => $names) {
            foreach ($names as $name) {
                Course::create(['level_id' => $levelId, 'name' => $name]);
            }
        }
    }
}
