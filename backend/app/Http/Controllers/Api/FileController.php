<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FileResource;
use App\Models\File;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function upload(Request $request, $taskId) {
        $request->validate([
            'file' => 'required|max:5120|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
        ]);

        $task = Task::findOrFail($taskId);

        if ($task->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permissions to upload.'], 401);
        }

        $fileName = $request->file("file")->hashName();

        $uploaded = $request->file("file")->storeAs("public/tasks/" . $taskId, $fileName);

        if ($uploaded) {
            $fileData = ["user_id" => auth()->user()->id, "name" => $fileName];

            $savedFile = $task->files()->create($fileData);

            if ($savedFile) {
                return new FileResource($savedFile);
            }
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function destroy(File $file) {
        if ($file->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permissions to delete.'], 401);
        }

        if ($file->delete()) {
            $deleted = Storage::delete("public/tasks/" . $file->task_id . "/" . $file->name);

            if ($deleted) {
                return response()->json(['message' => 'File deleted.']);
            }
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }
}
