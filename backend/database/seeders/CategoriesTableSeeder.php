<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use Database\Factories\TasksWithoutCategoryIdFactory;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::factory()->count(10)->create()
            ->each(function ($category) {
                $category->tasks()->saveMany(TasksWithoutCategoryIdFactory::new()->count(10)->make());
            });
    }
}
