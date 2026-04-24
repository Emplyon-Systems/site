<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage < 1 ? 15 : min($perPage, 100);

        $paginator = User::query()
            ->whereKeyNot($request->user()->id)
            ->orderBy('name')
            ->select(['id', 'name', 'email', 'email_verified_at', 'created_at'])
            ->paginate($perPage);

        return response()->json([
            'data' => $paginator->items(),
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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.unique' => 'Já existe um usuario com este email.',
            'password.min' => 'A palavra-passe deve ter pelo menos :min caracteres.',
            'password.confirmed' => 'A confirmação da palavra-passe não coincide.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        return response()->json([
            'data' => $user->only(['id', 'name', 'email', 'created_at']),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Altere os seus dados em Meu perfil.',
            ], 422);
        }

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        }

        $validated = $request->validate($rules, [
            'email.unique' => 'Já existe um usuario com este email.',
            'password.min' => 'A palavra-passe deve ter pelo menos :min caracteres.',
            'password.confirmed' => 'A confirmação da palavra-passe não coincide.',
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];
        if (! empty($validated['password'] ?? null)) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);

        return response()->json([
            'data' => $user->fresh()->only(['id', 'name', 'email', 'created_at']),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Não pode eliminar a sua própria conta.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario removido.',
        ]);
    }
}
