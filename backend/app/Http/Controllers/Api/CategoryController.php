<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = auth()->user()->categories()->with("tasks")->paginate(4);

        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required',
        ]);
        
        $category = auth()->user()->categories()->create($request->all());

        return $category;
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        if (auth()->user()->id != $category->user_id) {
            return response()->json(['message' => 'You are not authorized to view this category.'], 401);
        }

        $category->load("tasks");

        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        if (auth()->user()->id != $category->user_id) {
            return response()->json(['message' => 'You are not authorized to update this category.'], 401);
        }

        $validatedData = $request->validate([
            'title' => 'required',
        ]);
        
        if ($category->update($request->all())) {
            return ['message' => 'Category updated.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if (auth()->user()->id != $category->user_id) {
            return response()->json(['message' => 'You are not authorized to delete this category.'], 401);
        }

        if ($category->delete()) {
            return ['message' => 'Category deleted.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function restore($categoryId) {
        $category = Category::withTrashed()->findOrFail($categoryId);

        if (auth()->user()->id != $category->user_id) {
            return response()->json(['message' => 'You are not authorized to delete this category.'], 401);
        }

        if ($category->restore()) {
            return ['message' => 'Category restored.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }

    public function forceDelete($categoryId) {
        $category = Category::withTrashed()->findOrFail($categoryId);

        if (auth()->user()->id != $category->user_id) {
            return response()->json(['message' => 'You are not authorized to delete this category.'], 401);
        }

        if ($category->forceDelete()) {
            return ['message' => 'Category deleted.'];
        }

        return response()->json(['message' => 'Something went wrong.'], 500);
    }
}
