<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = ["user_id", "task_id", "name"];
    protected $appends = ["file_url"];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function task() {
        return $this->belongsTo(Task::class);
    }

    public function getFileUrlAttribute() {
        return asset("storage/files/" . $this->task_id . "/" . $this->name);
    }
}
