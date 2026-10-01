<?php

namespace App\Services;

use App\Models\MediaLibraryItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class ImageUploadService
{
    public function __construct(
        protected MediaLibraryRegistrar $registrar,
        protected ResponsiveImageService $responsiveImages,
    ) {
    }

    /**
     * Handle image upload with optimization.
     *
     * @param \Illuminate\Http\File|\Illuminate\Http\UploadedFile $file
     * @param string $folder
     * @return string|null
     */
    public function uploadImage($file, $folder = 'uploads')
    {
        try {
            if (!$this->validateImage($file)) {
                return null;
            }

            $filename = $this->generateUniqueFileName($file, 'webp');
            $destinationPath = public_path($folder);

            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $fullPath = "{$destinationPath}/{$filename}";

            // Convert to WebP and save using Intervention Image
            // The .webp extension of $fullPath determines the encoder.
            Image::decode($file)->save($fullPath, quality: 80);

            // Optimize the image using Spatie
            ImageOptimizer::optimize($fullPath);

            // Cap the stored size and write the narrower copies the
            // storefront's srcset points at.
            $this->responsiveImages->process($fullPath);

            $url = asset("{$folder}/{$filename}");

            // Make the upload visible in the media library, wherever it came from.
            $this->registrar->register(
                $url,
                method_exists($file, 'getClientOriginalName')
                    ? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
                    : null
            );

            return $url;
        } catch (\Exception $e) {
            Log::error("Failed to upload and optimize image: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Validate the uploaded image.
     *
     * @param \Illuminate\Http\File|\Illuminate\Http\UploadedFile $file
     * @return bool
     */
    private function validateImage($file)
    {
        $validator = Validator::make(['image' => $file], [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120', // Added max size (5MB)
        ]);

        if ($validator->fails()) {
            Log::warning("Image validation failed: " . json_encode($validator->errors()));
            return false;
        }

        return true;
    }

    /**
     * Generate a unique file name using UUID.
     *
     * @param \Illuminate\Http\File|\Illuminate\Http\UploadedFile $file
     * @param string $extension
     * @return string
     */
    private function generateUniqueFileName($file, $extension = 'webp')
    {
        return Str::uuid() . '.' . $extension;
    }

    /**
     * Delete a replaced image, unless it belongs to the media library.
     *
     * Once a field can be filled from the library, the old value may be a file
     * that other records still point at. Deleting it would break them and leave
     * an orphaned media_library_items row, so library-owned files are left
     * alone — the library page is the only place they get removed.
     *
     * @param string|null $filePath
     * @return bool
     */
    public function deleteFileUnlessInLibrary($filePath)
    {
        if (! $filePath) {
            return false;
        }

        $relative = ltrim(parse_url($filePath, PHP_URL_PATH) ?: $filePath, '/');

        if (MediaLibraryItem::where('path', $relative)->exists()) {
            return false;
        }

        return $this->deleteFile($filePath);
    }

    /**
     * Handle image removal from storage.
     *
     * @param string $filePath
     * @return bool
     */
    public function deleteFile($filePath)
    {
        try {
            // Convert URL to relative path
            $file = str_replace(url('/'), '', $filePath);
            $fullPath = public_path($file);

            clearstatcache();

            if (file_exists($fullPath) && is_writable($fullPath)) {
                unlink($fullPath);
                return true;
            }

            Log::warning("File not found or not writable: {$fullPath}");
            return false;
        } catch (\Exception $e) {
            Log::error("Failed to delete file: {$e->getMessage()}");
            return false;
        }
    }
}