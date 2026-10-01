<?php

namespace App\Services;

use App\Models\MediaLibraryItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Records an uploaded asset in the media library.
 *
 * Every upload point in the admin panel writes its file to public/ and stores
 * the path on its own record. Without this, the library only ever knew about
 * files uploaded through the library page itself, so it drifted further out of
 * date with every product, blog or banner edit. Upload services call this so a
 * file becomes visible in the library the moment it lands on disk.
 */
class MediaLibraryRegistrar
{
    private const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogv', 'mov', 'm4v', 'avi', 'mkv'];

    private const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'];

    /**
     * Register a stored file. Accepts a full URL or a path relative to public/.
     * Safe to call repeatedly for the same file — the path is unique.
     */
    public function register(?string $urlOrPath, ?string $title = null): ?MediaLibraryItem
    {
        if (! $urlOrPath) {
            return null;
        }

        try {
            $relativePath = $this->toRelativePath($urlOrPath);
            $fullPath = public_path($relativePath);

            if (! $relativePath || ! file_exists($fullPath)) {
                return null;
            }

            $existing = MediaLibraryItem::where('path', $relativePath)->first();
            if ($existing) {
                return $existing;
            }

            $kind = $this->kindFor($relativePath);
            [$width, $height, $mimeType] = $this->readImageMeta($fullPath, $kind);

            return MediaLibraryItem::create([
                'path' => $relativePath,
                'kind' => $kind,
                'title' => $title !== null && $title !== ''
                    ? $title
                    : Str::title(str_replace(['-', '_'], ' ', pathinfo($relativePath, PATHINFO_FILENAME))),
                'mime_type' => $mimeType ?? $this->guessMimeType($fullPath),
                'size' => filesize($fullPath) ?: null,
                'width' => $width,
                'height' => $height,
            ]);
        } catch (\Throwable $e) {
            // Registering is a side effect of an upload that already succeeded —
            // never let a library problem fail the upload itself.
            Log::warning("Could not register media library item: {$e->getMessage()}");

            return null;
        }
    }

    public function kindFor(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (in_array($extension, self::VIDEO_EXTENSIONS, true)) {
            return 'video';
        }

        if (in_array($extension, self::DOCUMENT_EXTENSIONS, true)) {
            return 'document';
        }

        return 'image';
    }

    public function toRelativePath(?string $urlOrPath): ?string
    {
        if (! $urlOrPath) {
            return null;
        }

        return ltrim(parse_url($urlOrPath, PHP_URL_PATH) ?: $urlOrPath, '/');
    }

    private function readImageMeta(string $fullPath, string $kind): array
    {
        if ($kind !== 'image') {
            return [null, null, null];
        }

        $info = @getimagesize($fullPath);

        return [$info[0] ?? null, $info[1] ?? null, $info['mime'] ?? null];
    }

    private function guessMimeType(string $fullPath): ?string
    {
        try {
            return mime_content_type($fullPath) ?: null;
        } catch (\Throwable) {
            return null;
        }
    }
}
