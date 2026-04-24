<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(BlogSeeder::class);

        User::updateOrCreate([
            'email' => env('ADMIN_EMAIL', 'admin@emplyon.com'),
        ], [
            'name' => env('ADMIN_NAME', 'Admin Emplyon'),
            'password' => Hash::make(env('ADMIN_PASSWORD', '12345678')),
            'email_verified_at' => now(),
        ]);
    }
}
