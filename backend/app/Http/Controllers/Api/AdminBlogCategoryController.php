<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class AdminBlogCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = BlogCategory::query()->orderBy('name')->get();

        return response()->json(['data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($validated['name']);
        if ($slug === '') {
            return response()->json(['message' => 'Nome inválido para gerar o slug.'], 422);
        }

        $base = $slug;
        $i = 2;
        while (BlogCategory::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        $category = BlogCategory::query()->create([
            'name' => trim($validated['name']),
            'slug' => $slug,
        ]);

        return response()->json(['data' => $category], 201);
    }

    public function update(Request $request, BlogCategory $blogCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($validated['name']);
        if ($slug === '') {
            return response()->json(['message' => 'Nome inválido para gerar o slug.'], 422);
        }

        $base = $slug;
        $i = 2;
        while (BlogCategory::query()->where('slug', $slug)->where('id', '!=', $blogCategory->id)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        $blogCategory->update([
            'name' => trim($validated['name']),
            'slug' => $slug,
        ]);

        return response()->json(['data' => $blogCategory->fresh()]);
    }

    public function destroy(BlogCategory $blogCategory): JsonResponse
    {
        $blogCategory->delete();

        return response()->json(['message' => 'Categoria removida.']);
    }
}
