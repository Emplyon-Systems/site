<?php

use App\Http\Controllers\Api\AdminBlogCategoryController;
use App\Http\Controllers\Api\AdminBlogPostController;
use App\Http\Controllers\Api\AdminBlogUploadController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicBlogController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::prefix('blog')->group(function (): void {
    Route::get('categories', [PublicBlogController::class, 'categories']);
    Route::get('posts', [PublicBlogController::class, 'posts']);
    Route::get('posts/{slug}/related', [PublicBlogController::class, 'related']);
    Route::get('posts/{slug}', [PublicBlogController::class, 'show']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);
    Route::patch('/me/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function (): void {
        Route::get('users', [AdminUserController::class, 'index']);
        Route::post('users', [AdminUserController::class, 'store']);
        Route::patch('users/{user}', [AdminUserController::class, 'update']);
        Route::delete('users/{user}', [AdminUserController::class, 'destroy']);

        Route::post('blog/upload', [AdminBlogUploadController::class, 'store']);

        Route::get('blog/categories', [AdminBlogCategoryController::class, 'index']);
        Route::post('blog/categories', [AdminBlogCategoryController::class, 'store']);
        Route::patch('blog/categories/{blogCategory}', [AdminBlogCategoryController::class, 'update']);
        Route::delete('blog/categories/{blogCategory}', [AdminBlogCategoryController::class, 'destroy']);

        Route::get('blog/posts', [AdminBlogPostController::class, 'index']);
        Route::post('blog/posts', [AdminBlogPostController::class, 'store']);
        Route::get('blog/posts/{blogPost}', [AdminBlogPostController::class, 'show']);
        Route::patch('blog/posts/{blogPost}', [AdminBlogPostController::class, 'update']);
        Route::delete('blog/posts/{blogPost}', [AdminBlogPostController::class, 'destroy']);
    });
});
