<?php

namespace App\Console\Commands;

use App\Services\ResponsiveImageService;
use Illuminate\Console\Command;
use Symfony\Component\Finder\Finder;

/**
 * Backfill for images uploaded before ResponsiveImageService existed.
 *
 * New uploads get their variants on the way in; everything already on disk
 * needs one pass of this. Safe to re-run — an existing variant is skipped
 * unless --force is given.
 *
 * Run it on deploy. The storefront's srcset advertises every width in
 * ResponsiveImageService::WIDTHS by naming convention, so an image that has
 * not been through here has no variants and depends on the fallback route.
 */
class GenerateImageVariants extends Command
{
    protected $signature = 'images:variants
        {--dir=* : Directories to scan, relative to public/ (default: the upload folders)}
        {--force : Rewrite variants that already exist}
        {--dry-run : Report what would be written without touching any file}';

    protected $description = 'Generate responsive variants for already-uploaded images';

    /**
     * Where images live. These are the paths the upload callers pass to
     * FileUploadTrait::uploadFile() and ImageUploadService::uploadImage(),
     * plus `storage` and the theme's own `assets`.
     */
    private const DEFAULT_DIRS = [
        'uploads', 'media', 'storage', 'products', 'gallery', 'slider',
        'users', 'reviews', 'product-reviews', 'featured_image', 'assets',
    ];

    public function handle(ResponsiveImageService $images): int
    {
        $dirs = $this->option('dir') ?: self::DEFAULT_DIRS;
        $force = (bool) $this->option('force');
        $dryRun = (bool) $this->option('dry-run');

        $existing = array_values(array_filter(
            array_map(fn ($dir) => public_path(trim($dir, '/')), $dirs),
            'is_dir'
        ));

        if ($existing === []) {
            $this->warn('None of the given directories exist under public/.');

            return self::SUCCESS;
        }

        $finder = (new Finder())
            ->files()
            ->in($existing)
            ->followLinks()
            ->name('/\.(webp|jpe?g|png)$/i');

        $scanned = 0;
        $capped = 0;
        $written = 0;
        $seen = [];

        foreach ($finder as $file) {
            $path = $file->getRealPath();

            // A directory reachable by two routes (public/storage being a
            // symlink on some hosts) resolves to one realpath, so each file
            // is processed once.
            if ($path === false || isset($seen[$path])) {
                continue;
            }

            $seen[$path] = true;

            // Skip the variants themselves, or a second pass would make
            // variants of variants.
            if ($images->parseVariantPath($path) !== null) {
                continue;
            }

            $scanned++;

            if ($dryRun) {
                continue;
            }

            if ($images->capOriginal($path)) {
                $capped++;
            }

            $written += count($images->generateVariants($path, $force));
        }

        $this->info($dryRun
            ? "{$scanned} images would be processed."
            : "Processed {$scanned} images: {$capped} capped to " . ResponsiveImageService::MAX_WIDTH . "px, {$written} variants written.");

        return self::SUCCESS;
    }
}
