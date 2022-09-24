<?php

use Illuminate\Database\Seeder;
use App\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Guard',
            'email' => 'guard@gmail.com',
            'user_type' => 'guard',
            'password' => bcrypt('123456'),
            'created_by' => 0,
            'updated_by' => 0,
        ]);
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'user_type' => 'admin',
            'password' => bcrypt('123456'),
            'created_by' => 0,
            'updated_by' => 0,
        ]);
    }
}
