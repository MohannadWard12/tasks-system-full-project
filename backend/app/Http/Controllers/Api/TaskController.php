<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = auth()->user()->tasks()->with("category", "comments", "files")->paginate(10);

        return TaskResource::collection($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        date_default_timezone_set("UTC");

        $validatedData = $request->validate([
            'title' => 'required',
            'category_id' => 'required',
            "due_date" => "required|date|date_format:Y-m-d|after_or_equal:" . date("Y-m-d")
        ]);

        $category = Category::findOrFail($validatedData["category_id"]);

        if ($category->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permission to add tasks to this category.'], 401);
        }

        $request["user_id"] = auth()->user()->id;

        $task = Task::create($request->all());

        if ($task) {
            return $task;
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to view.'], 401);
        }

        $task->load("category", "comments", "files");

        return new TaskResource($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to edit.'], 401);
        }

        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'title' => 'required',
            'category_id' => 'required',
            "due_date" => "required|date|date_format:Y-m-d"
        ]);

        $category = Category::findOrFail($validatedData["category_id"]);

        if ($category->user_id != auth()->user()->id || auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to update.'], 401);
        }

        $updated = $task->update($request->all());

        if ($updated) {
            return response()->json(['message' => 'Task updated.'], 200);
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to delete.'], 401);
        }

        if ($task->delete()) {
            return response()->json(['message' => 'Task deleted.'], 200);
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function complete(Request $request, $taskId) {
        $task = Task::findOrFail($taskId);

        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to complete.'], 401);
        }

        if ($task->update(["completed" => ($request->completed === true ? 1 : 0)])) {
            if ($request->completed === true) {
                return response()->json(['message' => 'Task completed.'], 200);
            } else {
                return response()->json(['message' => 'Task uncompleted.'], 200);
            }
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function restore($taskId) {
        $task = Task::withTrashed()->findOrFail($taskId);

        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to restore.'], 401);
        }

        if ($task->restore()) { 
            return response()->json(['message' => 'Task restored.'], 200);
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function forceDelete($taskId) {
        $task = Task::withTrashed()->findOrFail($taskId);

        if (auth()->user()->id != $task->user_id) {
            return response()->json(['message' => 'You do not have permissions to delete.'], 401);
        }

        if ($task->forceDelete()) {
            Storage::deleteDirectory("public/tasks/" . $task->id);

            return response()->json(['message' => 'Task deleted.'], 200);
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }
}
