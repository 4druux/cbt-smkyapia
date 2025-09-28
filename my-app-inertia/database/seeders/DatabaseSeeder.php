<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Andrew S',
            'email' => 'admin123@gmail.com',
            'password' => '12345678',
            'role' => 'superadmin'
        ]);

        DB::table('academic_years')->delete();

        for ($startYear = 2022; $startYear <= 2026; $startYear++) {
            $endYear = $startYear + 1;
            AcademicYear::create([
                'year' => $startYear . '-' . $endYear
            ]);
        }
    }
}

