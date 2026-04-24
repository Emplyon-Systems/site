<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicBlogController extends Controller
{
    public function categories(): JsonResponse
    {
        $rows = BlogCategory::query()
            ->withCount([
                'posts as published_posts_count' => fn ($q) => $q->where('published', true)->whereNotNull('published_at'),
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json(['data' => $rows]);
    }

    public function posts(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 8);
        $perPage = $perPage < 1 ? 8 : min($perPage, 50);

        $q = BlogPost::query()
            ->with('category:id,name,slug')
            ->where('published', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at');

        if ($request->filled('category_slug')) {
            $slug = $request->query('category_slug');
            $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
        }

        if ($request->filled('search')) {
            $term = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $request->query('search')).'%';
            $q->where(function ($q2) use ($term) {
                $q2->where('title', 'like', $term)->orWhere('excerpt', 'like', $term);
            });
        }

        $paginator = $q->paginate($perPage);

        $data = collect($paginator->items())->map(fn (BlogPost $p) => $this->transformPublicPost($p))->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->with('category:id,name,slug')
            ->where('slug', $slug)
            ->where('published', true)
            ->whereNotNull('published_at')
            ->firstOrFail();

        return response()->json(['data' => $this->transformPublicPost($post, true)]);
    }

    public function related(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        $q = BlogPost::query()
            ->with('category:id,name,slug')
            ->where('published', true)
            ->whereNotNull('published_at')
            ->where('id', '!=', $post->id)
            ->orderByDesc('published_at')
            ->limit(3);

        if ($post->blog_category_id) {
            $q->where('blog_category_id', $post->blog_category_id);
        }

        $rows = $q->get();

        if ($rows->count() < 3) {
            $more = BlogPost::query()
                ->with('category:id,name,slug')
                ->where('published', true)
                ->whereNotNull('published_at')
                ->where('id', '!=', $post->id)
                ->whereNotIn('id', $rows->pluck('id'))
                ->orderByDesc('published_at')
                ->limit(3 - $rows->count())
                ->get();
            $rows = $rows->concat($more);
        }

        $data = $rows->map(fn (BlogPost $p) => $this->transformPublicPost($p))->values();

        return response()->json(['data' => $data]);
    }

    private function transformPublicPost(BlogPost $p, bool $includeContent = false): array
    {
        $out = [
            'id' => (string) $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'excerpt' => $p->excerpt,
            'author' => $p->author,
            'readTime' => $p->read_time,
            'coverImage' => $p->cover_image_url ?? 'https://placehold.co/1200x630/e2e8f0/64748b?text=Emplyon',
            'category' => $p->category?->name ?? 'Geral',
            'date' => $p->published_at?->toDateString(),
            'tags' => [],
        ];

        if ($includeContent) {
            $out['content'] = $p->content ?? [];
        }

        return $out;
    }
}
