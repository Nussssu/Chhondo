<?php

namespace App\Traits;

use App\Services\MediaLibraryRegistrar;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;
use Intervention\Image\Laravel\Facades\Image;

trait FileUploadTrait
{
    // Target webp size in bytes (400 KB)
    private const WEBP_TARGET_BYTES = 400 * 1024;

    /**
     * Upload a single file, convert to webp and optimize.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string public URL
     *
     * @throws \Exception
     */
    public function uploadFile(UploadedFile $file, string $path = '/uploads'): string
    {
        try {
            $fileName = 'media_' . uniqid() . '.webp';
            $destinationPath = public_path(trim($path, '/'));

            $this->ensureDirectoryExists($destinationPath);

            $fullPath = $destinationPath . DIRECTORY_SEPARATOR . $fileName;

            // Save optimized webp with target size (400KB by default)
            $this->saveOptimizedWebp($file, $fullPath, self::WEBP_TARGET_BYTES);

            $this->makeResponsive($fullPath);

            $url = url(trim($path, '/') . '/' . $fileName);

            $this->registerInMediaLibrary($url, $file);

            return $url;
        } catch (\Exception $e) {
            throw new \Exception("Failed to upload and optimize image: " . $e->getMessage());
        }
    }

    /**
     * Upload multiple files, convert each to webp and optimize.
     *
     * @param array $uploadedFiles
     * @param string $path
     * @return array
     */
    public function uploadMultipleFiles(array $uploadedFiles, string $path = '/uploads'): array
    {
        $savedImages = [];
        $errors = [];

        if (empty($uploadedFiles) || !is_array($uploadedFiles)) {
            return [
                'savedImages' => $savedImages,
                'errors' => ['No valid files uploaded.'],
            ];
        }

        $destinationPath = public_path(trim($path, '/'));
        $this->ensureDirectoryExists($destinationPath);

        foreach ($uploadedFiles as $file) {
            try {
                $fileName = 'media_' . uniqid() . '.webp';
                $fullPath = $destinationPath . DIRECTORY_SEPARATOR . $fileName;

                $this->saveOptimizedWebp($file, $fullPath, self::WEBP_TARGET_BYTES);

                $this->makeResponsive($fullPath);

                $url = url(trim($path, '/') . '/' . $fileName);

                $this->registerInMediaLibrary($url, $file);

                $savedImages[] = $url;
            } catch (\Exception $e) {
                $originalName = method_exists($file, 'getClientOriginalName') ? $file->getClientOriginalName() : 'unknown';
                $errors[] = "Error processing image {$originalName}: " . $e->getMessage();
                // Log::warning("Image upload error for {$originalName}: " . $e->getMessage());
            }
        }

        return [
            'savedImages' => $savedImages,
            'errors' => $errors,
        ];
    }

    /**
     * Replace an existing file with a new upload.
     *
     * @param UploadedFile $file
     * @param string $oldFilePath
     * @param string $path
     * @return string
     */
    public function updateFile(UploadedFile $file, string $oldFilePath, string $path = '/uploads'): string
    {
        // Remove the old file (accept either path or URL)
        $oldLocalPath = $this->localPathFromPossibleUrl($oldFilePath);
        if ($oldLocalPath && file_exists($oldLocalPath)) {
            @unlink($oldLocalPath);
        }

        // Upload the new file
        return $this->uploadFile($file, $path);
    }

    /**
     * Update product gallery (keeps same signature / behavior)
     *
     * @param Request $request
     * @param $product
     * @return array
     */
    public function updateProductGallery(Request $request, $product)
    {
        if ($request->hasFile('gallery_images')) {
            $existingGalleryImages = json_decode($product->gallery_images, true);
            $validImages = [];

            if (is_array($existingGalleryImages)) {
                foreach ($existingGalleryImages as $entry) {
                    if (is_string($entry) && !empty($entry)) {
                        $validImages[] = $entry;
                    } elseif (is_array($entry)) {
                        foreach ($entry as $url) {
                            if (is_string($url) && !empty($url)) {
                                $validImages[] = $url;
                            }
                        }
                    } else {
                        // Log::warning('Skipping invalid gallery image entry: ' . json_encode($entry));
                    }
                }
            }

            $uploadResult = $this->uploadMultipleFiles($request->file('gallery_images'), 'gallery');

            return $uploadResult['savedImages'];
        }

        return [];
    }

    /**
     * Delete featured image (keeps behavior but improved path parsing)
     *
     * @param mixed $featuredImage
     * @return void
     */
    public function deleteFeaturedImage($featuredImage)
    {
        if ($featuredImage) {
            $featuredImagePath = $this->localPathFromPossibleUrl($featuredImage) ?: public_path('featured_image/' . basename($featuredImage));

            if (file_exists($featuredImagePath)) {
                @unlink($featuredImagePath);
            } else {
                // Log::info('Featured image not found: ' . $featuredImagePath);
            }
        }
    }

    /**
     * Delete gallery images if they exist (keeps behavior)
     *
     * @param string $galleryImagesJson
     * @return void
     */
    public function deleteGalleryImages($galleryImagesJson)
    {
        $galleryImages = json_decode($galleryImagesJson, true);

        if (is_array($galleryImages)) {
            foreach ($galleryImages as $image) {
                $galleryImagePath = $this->localPathFromPossibleUrl($image) ?: public_path('products/' . basename($image));

                if (file_exists($galleryImagePath)) {
                    @unlink($galleryImagePath);
                    // Log::info('Gallery image deleted successfully: ' . $galleryImagePath);
                } else {
                    // Log::info('Gallery image not found: ' . $galleryImagePath);
                }
            }
        }
    }

    /* -------------------- Helpers -------------------- */

    /**
     * Write the narrower copies the storefront's srcset points at.
     *
     * saveOptimizedWebp() only shrinks an image that overshoots its byte
     * target, so a 1000x1500 photo landing under 400KB was stored at full
     * resolution and served, untouched, into a 200px-tall card.
     *
     * Resolved from the container because this is a trait — the classes using
     * it have their own constructors to leave alone.
     */
    private function makeResponsive(string $fullPath): void
    {
        app(\App\Services\ResponsiveImageService::class)->process($fullPath);
    }

    /**
     * Resolve a product video from either a fresh upload or a library pick.
     *
     * Videos are stored as a path relative to public/ (the storefront joins it
     * onto the backend URL), not as the absolute URL images use.
     *
     * @param mixed $uploadedFile
     * @param string|null $libraryPath
     * @return string|null null when neither was supplied
     */
    private function resolveVideoPath($uploadedFile, ?string $libraryPath): ?string
    {
        $registrar = app(MediaLibraryRegistrar::class);

        if ($uploadedFile instanceof UploadedFile) {
            $url = app(\App\Services\FileUploadService::class)->upload($uploadedFile, 'products/videos');

            return $url ? $registrar->toRelativePath($url) : null;
        }

        if ($libraryPath) {
            return $registrar->toRelativePath($libraryPath);
        }

        return null;
    }

    /**
     * Record an upload in the media library so it is picker-visible everywhere.
     *
     * @param string $url
     * @param mixed $file
     * @return void
     */
    private function registerInMediaLibrary(string $url, $file = null): void
    {
        $title = ($file && method_exists($file, 'getClientOriginalName'))
            ? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
            : null;

        app(MediaLibraryRegistrar::class)->register($url, $title);
    }

    /**
     * Ensure directory exists, create recursively if needed.
     *
     * @param string $destinationPath
     * @return void
     * @throws \Exception
     */
    private function ensureDirectoryExists(string $destinationPath): void
    {
        if (!is_dir($destinationPath)) {
            if (!mkdir($destinationPath, 0755, true) && !is_dir($destinationPath)) {
                throw new \Exception("Unable to create directory: {$destinationPath}");
            }
        }
    }

    /**
     * Convert input (UploadedFile/path/url) to an optimized WebP file trying to meet a target size.
     *
     * Strategy:
     *  - Try iterative re-encoding (quality steps) from $startQuality down to $minQuality.
     *  - If still too big, progressively resize while keeping aspect ratio until target is met or minimum scale reached.
     *  - Always run Spatie ImageOptimizer at the end.
     *
     * @param UploadedFile|string $source
     * @param string $fullPath
     * @param int $targetBytes
     * @return void
     * @throws \Exception
     */
    private function saveOptimizedWebp($source, string $fullPath, int $targetBytes = self::WEBP_TARGET_BYTES): void
    {
        // Parameters you can tweak:
        $startQuality = 80;
        $minQuality = 35;
        $qualityStep = 5;
        $minScale = 0.3; // don't shrink below 30% of original dimensions
        $scaleStep = 0.9; // multiply by this each iteration (progressively smaller)

        // 1) Try quality-only loop
        $quality = $startQuality;
        while ($quality >= $minQuality) {
            try {
                // read fresh for each attempt
                $img = Image::decode($source);

                // encode & save (the .webp extension of $fullPath picks the encoder)
                $img->save($fullPath, quality: $quality);

                // ensure filesystem stats fresh
                clearstatcache(true, $fullPath);

                if (file_exists($fullPath) && filesize($fullPath) <= $targetBytes) {
                    // Try spatie optimize and return
                    try {
                        ImageOptimizer::optimize($fullPath);
                    } catch (\Throwable $optEx) {
                        // do not fail entire flow if optimizer missing or fails
                        // Log::warning("ImageOptimizer failed: " . $optEx->getMessage());
                    }
                    return;
                }
            } catch (\Throwable $ex) {
                // keep reducing quality; log and continue
                // Log::debug("WebP attempt quality {$quality} failed: " . $ex->getMessage());
            }

            $quality -= $qualityStep;
        }

        // 2) If we reach here, quality-only didn't reach target. Try progressive resizing + re-encoding.
        $scale = 1.0;
        while ($scale >= $minScale) {
            try {
                $img = Image::decode($source);

                // scale down to target width, aspect ratio kept automatically
                $newWidth = (int) max(1, $img->width() * $scale);
                $img->scaleDown(width: $newWidth);

                // use the best quality remaining (minQuality)
                $img->save($fullPath, quality: $minQuality);

                clearstatcache(true, $fullPath);

                if (file_exists($fullPath) && filesize($fullPath) <= $targetBytes) {
                    try {
                        ImageOptimizer::optimize($fullPath);
                    } catch (\Throwable $optEx) {
                        // Log::warning("ImageOptimizer failed: " . $optEx->getMessage());
                    }
                    return;
                }
            } catch (\Throwable $ex) {
                // Log::debug("WebP resizing attempt scale {$scale} failed: " . $ex->getMessage());
            }

            $scale = $scale * $scaleStep; // e.g., 1.0 -> 0.9 -> 0.81 -> ...
        }

        // 3) final attempt: save with lowest allowed quality and let optimizer run
        try {
            $img = Image::decode($source);
            $img->save($fullPath, quality: $minQuality);
            try {
                ImageOptimizer::optimize($fullPath);
            } catch (\Throwable $optEx) {
                // Log::warning("ImageOptimizer final optimize failed: " . $optEx->getMessage());
            }
        } catch (\Throwable $ex) {
            throw new \Exception("Failed to encode/optimize image: " . $ex->getMessage());
        }
    }

    /**
     * Convert a possible URL into a local public path (or return null).
     *
     * @param string $maybeUrl
     * @return string|null
     */
    private function localPathFromPossibleUrl(string $maybeUrl): ?string
    {
        // If it's already a local filesystem path
        if (file_exists($maybeUrl)) {
            return $maybeUrl;
        }

        // If it's a full URL, try to extract the path and make it public_path
        $parsed = parse_url($maybeUrl, PHP_URL_PATH);
        if ($parsed) {
            $local = public_path(ltrim($parsed, '/'));
            if (file_exists($local)) {
                return $local;
            }
        }

        return null;
    }
}
