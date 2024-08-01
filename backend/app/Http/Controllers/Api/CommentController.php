<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validatedData = $request->validate([
            'task_id' => 'required',
            'body' => 'required',
        ]);
        
        $task = Task::findOrFail($validatedData["task_id"]);

        if ($task->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permission to add comments to this task.'], 401);
        }

        $request["user_id"] = auth()->user()->id;

        $comment = Comment::create($request->all());

        if ($comment) {
            return $comment;
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        $validatedData = $request->validate([
            'body' => 'required',
        ]);

        if ($comment->task->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permission to update this comment.'], 401);
        }

        $updated = $comment->update($validatedData);

        if ($updated) {
            return ['message' => 'Comment updated.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        if ($comment->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permission to delete this comment.'], 401);
        }

        $deleted = $comment->delete();

        if ($deleted) {
            return ['message' => 'Comment deleted.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function restore($commentId)
    {
        $comment = Comment::withTrashed()->findOrFail($commentId);

        if ($comment->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permissions to restore.'], 401);
        }

        if ($comment->restore()) {
            return ['message' => 'Comment restored.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function forceDelete($commentId)
    {
        $comment = Comment::withTrashed()->findOrFail($commentId);

        if ($comment->user_id != auth()->user()->id) {
            return response()->json(['message' => 'You do not have permissions to force delete.'], 401);
        }

        if ($comment->forceDelete()) {
            return ['message' => 'Comment force deleted.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }
}
