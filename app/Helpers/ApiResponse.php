<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A single JSON envelope for every response this helper produces.
 *
 * Previously `success()` returned the payload bare (its envelope was commented out)
 * while `error()`, `validationError()` and `paginatedSuccess()` each wrapped it in a
 * different shape. Callers could not rely on any of it — `Products/Index.vue` reads
 * `response.message` from the bulk publish/unpublish endpoints and always got
 * `undefined`, so the confirmation dialog showed an empty message.
 *
 * Every method now returns the same top-level keys:
 *
 *     { "success": bool, "message": string, "data": mixed, "errors": object|null,
 *       "meta": object|null, "pagination": object|null }
 *
 * JSON_UNESCAPED_UNICODE is applied throughout so Bangla content is readable rather
 * than \u-escaped.
 */
class ApiResponse
{
    private const JSON_FLAGS = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

    public static function success(
        mixed $data = [],
        string $message = 'Success',
        int $statusCode = Response::HTTP_OK,
        array $meta = [],
        array $headers = []
    ): JsonResponse {
        return self::envelope(true, $message, $data, $statusCode, $headers, meta: $meta);
    }

    public static function error(
        string $message = 'Error',
        int $statusCode = Response::HTTP_BAD_REQUEST,
        mixed $data = null,
        array $headers = []
    ): JsonResponse {
        return self::envelope(false, $message, $data, $statusCode, $headers);
    }

    public static function validationError(
        array $errors,
        string $message = 'Validation failed',
        int $statusCode = Response::HTTP_UNPROCESSABLE_ENTITY,
        array $headers = []
    ): JsonResponse {
        return self::envelope(false, $message, null, $statusCode, $headers, errors: $errors);
    }

    public static function notFound(
        string $message = 'Not Found',
        int $statusCode = Response::HTTP_NOT_FOUND,
        array $headers = []
    ): JsonResponse {
        return self::error($message, $statusCode, null, $headers);
    }

    /**
     * @param  \Illuminate\Contracts\Pagination\Paginator  $data
     */
    public static function paginatedSuccess(
        $data,
        string $message = 'Success',
        int $statusCode = Response::HTTP_OK,
        array $meta = [],
        array $headers = []
    ): JsonResponse {
        return self::envelope(true, $message, $data->items(), $statusCode, $headers, meta: $meta, pagination: [
            'total' => $data->total(),
            'per_page' => $data->perPage(),
            'current_page' => $data->currentPage(),
            'last_page' => $data->lastPage(),
            'next_page_url' => $data->nextPageUrl(),
            'prev_page_url' => $data->previousPageUrl(),
        ]);
    }

    private static function envelope(
        bool $success,
        string $message,
        mixed $data,
        int $statusCode,
        array $headers,
        ?array $errors = null,
        array $meta = [],
        ?array $pagination = null
    ): JsonResponse {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
            'meta' => $meta ?: null,
            'pagination' => $pagination,
        ], $statusCode, $headers, self::JSON_FLAGS);
    }
}
