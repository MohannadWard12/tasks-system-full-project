<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use \App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\TaskController;

Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);

Route::middleware('auth:api')->prefix("user")->group(function () {
    Route::post("update/password", [UserController::class, "updatePassword"]);
    Route::post("update/profile", [UserController::class, "updateProfile"]);
});

Route::resource("categories", CategoryController::class)->middleware("auth:api");
Route::put("/categories/{categoryId}/restore", [CategoryController::class, "restore"])->middleware("auth:api");
Route::delete("/categories/{categoryId}/force-delete", [CategoryController::class, "forceDelete"])->middleware("auth:api");

Route::resource("tasks", TaskController::class)->middleware("auth:api");
Route::put("/tasks/{taskId}/complete", [TaskController::class, "complete"])->middleware("auth:api");
Route::put("/tasks/{taskId}/restore", [TaskController::class, "restore"])->middleware("auth:api");
Route::delete("/tasks/{taskId}/force-delete", [TaskController::class, "forceDelete"])->middleware("auth:api");
Route::post("/tasks/{taskId}/upload-file", [FileController::class, "upload"])->middleware("auth:api");

Route::delete("/files/{file}", [FileController::class, "destroy"])->middleware("auth:api");

Route::resource("comments", CommentController::class)->middleware("auth:api");
Route::put("/comments/{commentId}/restore", [CommentController::class, "restore"])->middleware("auth:api");
Route::delete("/comments/{commentId}/force-delete", [CommentController::class, "forceDelete"])->middleware("auth:api");