<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminBlogPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage < 1 ? 15 : min($perPage, 100);

        $paginator = BlogPost::query()
            ->with('category:id,name,slug')
            ->orderByDesc('updated_at')
            ->paginate($perPage);

        $data = collect($paginator->items())->map(fn (BlogPost $p) => $this->transformList($p))->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        $blogPost->load('category:id,name,slug');

        return response()->json(['data' => $this->transformDetail($blogPost)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatedPayload($request);
        $slug = BlogPost::uniqueSlugFromTitle($validated['title']);

        $coverPath = null;
        $coverExternal = $validated['cover_image_external'] ?? null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('blog/covers', 'public');
            $coverExternal = null;
        }

        $published = $validated['published'];
        $now = Carbon::now();

        $post = BlogPost::query()->create([
            'blog_category_id' => $validated['blog_category_id'],
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'],
            'author' => $validated['author'] ?: 'Equipe Emplyon',
            'read_time' => $validated['read_time'] ?: '5 min',
            'cover_image_path' => $coverPath,
            'cover_image_external' => $coverExternal,
            'content' => $validated['content'],
            'published' => $published,
            'published_at' => $published ? $now : null,
        ]);

        $post->load('category:id,name,slug');

        return response()->json(['data' => $this->transformDetail($post)], 201);
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $this->validatedPayload($request);
        $slug = BlogPost::uniqueSlugFromTitle($validated['title'], $blogPost->id);

        if ($request->boolean('remove_cover')) {
            if ($blogPost->cover_image_path) {
                Storage::disk('public')->delete($blogPost->cover_image_path);
            }
            $blogPost->cover_image_path = null;
            $blogPost->cover_image_external = null;
        }

        if ($request->hasFile('cover')) {
            if ($blogPost->cover_image_path) {
                Storage::disk('public')->delete($blogPost->cover_image_path);
            }
            $blogPost->cover_image_path = $request->file('cover')->store('blog/covers', 'public');
            $blogPost->cover_image_external = null;
        } elseif (! $request->boolean('remove_cover') && $request->filled('cover_image_external')) {
            if ($blogPost->cover_image_path) {
                Storage::disk('public')->delete($blogPost->cover_image_path);
            }
            $blogPost->cover_image_path = null;
            $blogPost->cover_image_external = $request->string('cover_image_external')->toString();
        }

        $published = $validated['published'];
        $publishedAt = $blogPost->published_at;
        if ($published && ! $publishedAt) {
            $publishedAt = Carbon::now();
        }
        if (! $published) {
            $publishedAt = null;
        }

        $blogPost->update([
            'blog_category_id' => $validated['blog_category_id'],
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'],
            'author' => $validated['author'] ?: 'Equipe Emplyon',
            'read_time' => $validated['read_time'] ?: '5 min',
            'cover_image_path' => $blogPost->cover_image_path,
            'cover_image_external' => $blogPost->cover_image_external,
            'content' => $validated['content'],
            'published' => $published,
            'published_at' => $publishedAt,
        ]);

        $blogPost->load('category:id,name,slug');

        return response()->json(['data' => $this->transformDetail($blogPost->fresh())]);
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        if ($blogPost->cover_image_path) {
            Storage::disk('public')->delete($blogPost->cover_image_path);
        }
        $blogPost->delete();

        return response()->json(['message' => 'Artigo removido.']);
    }

    private function validatedPayload(Request $request): array
    {
        $bc = $request->input('blog_category_id');
        if ($bc === '' || $bc === 'null') {
            $request->merge(['blog_category_id' => null]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string'],
            'author' => ['nullable', 'string', 'max:255'],
            'read_time' => ['nullable', 'string', 'max:64'],
            'blog_category_id' => ['nullable', 'exists:blog_categories,id'],
            'published' => ['boolean'],
            'content' => ['required', 'json'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'cover_image_external' => ['sometimes', 'nullable', 'string', 'max:2048', 'url'],
            'remove_cover' => ['sometimes', 'boolean'],
        ]);

        $decoded = json_decode($validated['content'], true);
        if (! is_array($decoded)) {
            abort(422, 'Conteúdo JSON inválido.');
        }

        $validated['content'] = $decoded;
        $validated['published'] = $request->boolean('published');
        $validated['blog_category_id'] = $validated['blog_category_id'] ?? null;

        return $validated;
    }

    private function transformList(BlogPost $p): array
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'excerpt' => $p->excerpt,
            'author' => $p->author,
            'readTime' => $p->read_time,
            'coverImage' => $p->cover_image_url,
            'categoryId' => $p->blog_category_id,
            'category' => $p->category?->name,
            'published' => $p->published,
            'publishedAt' => $p->published_at?->toIso8601String(),
            'updatedAt' => $p->updated_at->toIso8601String(),
        ];
    }

    private function transformDetail(BlogPost $p): array
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'excerpt' => $p->excerpt,
            'author' => $p->author,
            'readTime' => $p->read_time,
            'coverImage' => $p->cover_image_url,
            'categoryId' => $p->blog_category_id,
            'category' => $p->category ? [
                'id' => $p->category->id,
                'name' => $p->category->name,
                'slug' => $p->category->slug,
            ] : null,
            'content' => $p->content ?? [],
            'published' => $p->published,
            'publishedAt' => $p->published_at?->toIso8601String(),
            'createdAt' => $p->created_at->toIso8601String(),
            'updatedAt' => $p->updated_at->toIso8601String(),
        ];
    }
}
