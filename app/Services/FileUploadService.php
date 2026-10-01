<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Stores non-image assets (video, documents) as-is.
 *
 * ImageUploadService re-encodes everything to WebP, which is right for images
 * and destructive for anything else. Videos and PDFs keep their original
 * format and extension here.
 */
class FileUploadService
{
    public function __construct(protected MediaLibraryRegistrar $registrar)
    {
    }

    /**
     * Save a file under public/{folder} and register it in the media library.
     *
     * @return string|null public URL, or null if the file could not be stored
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): ?string
    {
        try {
            $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin');
            $filename = Str::uuid() . '.' . $extension;

            $destinationPath = public_path($folder);
            if (! is_dir($destinationPath) && ! mkdir($destinationPath, 0755, true) && ! is_dir($destinationPath)) {
                throw new \RuntimeException("Unable to create directory: {$destinationPath}");
            }

            $file->move($destinationPath, $filename);

            $url = asset("{$folder}/{$filename}");

            $this->registrar->register(
                $url,
                pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
            );

            return $url;
        } catch (\Throwable $e) {
            Log::error("Failed to upload file: {$e->getMessage()}");

            return null;
        }
    }
}
