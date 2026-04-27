<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicContactRequestController extends Controller
{
    private const MIN_FILL_SECONDS = 3;

    private const MAX_FILL_SECONDS = 7200;

    public function store(Request $request): JsonResponse
    {
        if ($this->shouldSilentlyBlock($request)) {
            return response()->json([
                'message' => 'Solicitação enviada com sucesso.',
            ], 201);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:64'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'employees' => ['nullable', 'string', 'max:64'],
            'message' => ['nullable', 'string', 'max:5000'],
            'started_at' => ['required', 'integer'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        ContactRequest::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'employees' => $validated['employees'] ?? null,
            'message' => $validated['message'] ?? null,
            'source' => 'falar-com-especialista',
        ]);

        return response()->json([
            'message' => 'Solicitação enviada com sucesso.',
        ], 201);
    }

    private function shouldSilentlyBlock(Request $request): bool
    {
        if ($request->filled('website')) {
            return true;
        }

        $startedAtMs = (int) $request->input('started_at', 0);
        if ($startedAtMs <= 0) {
            return true;
        }

        $elapsed = now()->timestamp - intdiv($startedAtMs, 1000);

        return $elapsed < self::MIN_FILL_SECONDS || $elapsed > self::MAX_FILL_SECONDS;
    }
}
