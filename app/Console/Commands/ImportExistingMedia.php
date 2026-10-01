<?php

namespace App\Console\Commands;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Media;
use App\Models\MediaLibraryItem;
use App\Models\Product;
use App\Models\SidebarSlider;
use App\Models\SiteInfo;
use App\Services\MediaLibraryRegistrar;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportExistingMedia extends Command
{
    protected $signature = 'media:import-existing';

    protected $description = 'Import already-uploaded images on disk and referenced in content tables into the media library';

    private const IMAGE_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
        // Video and documents are indexed too — the library is no longer
        // images-only, and product videos predate it.
        'mp4', 'webm', 'ogv', 'mov', 'm4v',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv',
    ];

    private const SCAN_FOLDERS = [
        'uploads',
        'products',
        'products/videos',
        'gallery',
        'featured_image',
        'media',
        'debit',
        'Category',
        'category',
        'reviews',
        'product-reviews',
        'users',
        'assets/image/admin/manage',
        // The landing-page clips shipped with the theme rather than being
        // uploaded, so nothing had ever indexed them.
        'assets/videos',
    ];

    public function handle(): int
    {
        $created = 0;
        $skipped = 0;

        foreach (self::SCAN_FOLDERS as $folder) {
            $dir = public_path($folder);
            if (! is_dir($dir)) {
                continue;
            }

            foreach ($this->iterateImageFiles($dir) as $fullPath) {
                $relativePath = ltrim(Str::after($fullPath, public_path()), '/');
                if ($this->importPath($relativePath)) {
                    $created++;
                } else {
                    $skipped++;
                }
            }
        }

        foreach ($this->collectReferencedPaths() as $path) {
            if ($this->importPath($path)) {
                $created++;
            } else {
                $skipped++;
            }
        }

        $this->info("Media import complete. Created: {$created}, Skipped (missing file / already imported): {$skipped}");

        return self::SUCCESS;
    }

    private function iterateImageFiles(string $dir): \Generator
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if (! $file->isFile()) {
                continue;
            }

            $ext = strtolower($file->getExtension());
            if (in_array($ext, self::IMAGE_EXTENSIONS, true)) {
                yield $file->getPathname();
            }
        }
    }

    private function collectReferencedPaths(): array
    {
        $paths = [];

        Product::query()->select('featured_image', 'gallery_images')->chunk(200, function ($products) use (&$paths) {
            foreach ($products as $product) {
                $paths[] = $product->getRawOriginal('featured_image');
                $gallery = $product->getRawOriginal('gallery_images');
                $decoded = is_string($gallery) ? json_decode($gallery, true) : $gallery;
                if (is_array($decoded)) {
                    foreach ($decoded as $entry) {
                        if (is_string($entry)) {
                            $paths[] = $entry;
                        }
                    }
                }
            }
        });

        Blog::query()->select('image')->chunk(200, function ($blogs) use (&$paths) {
            foreach ($blogs as $blog) {
                $paths[] = $blog->getRawOriginal('image');
            }
        });

        Category::query()->select('image')->chunk(200, function ($categories) use (&$paths) {
            foreach ($categories as $category) {
                $paths[] = $category->getRawOriginal('image');
            }
        });

        if (class_exists(SidebarSlider::class)) {
            SidebarSlider::query()->select('image_path', 'mobile_image_path')->chunk(200, function ($sliders) use (&$paths) {
                foreach ($sliders as $slider) {
                    $paths[] = $slider->getRawOriginal('image_path');
                    $paths[] = $slider->getRawOriginal('mobile_image_path');
                }
            });
        }

        if (class_exists(SiteInfo::class)) {
            SiteInfo::query()->select('store_gateway_image')->chunk(200, function ($infos) use (&$paths) {
                foreach ($infos as $info) {
                    $paths[] = $info->getRawOriginal('store_gateway_image');
                }
            });
        }

        // Page widgets hold their own media: video strips, galleries, image and
        // image+text blocks. None of it was indexed, so a clip used on the home
        // page never appeared in the library it is meant to be picked from.
        if (class_exists(\App\Models\Page::class)) {
            \App\Models\Page::query()->select('blocks')->chunk(50, function ($pages) use (&$paths) {
                foreach ($pages as $page) {
                    foreach ($this->pathsInBlocks($page->blocks) as $path) {
                        $paths[] = $path;
                    }
                }
            });
        }

        $media = Media::first();
        if ($media) {
            $paths[] = $media->getRawOriginal('logo');
            $paths[] = $media->getRawOriginal('favicon');
            $paths[] = $media->getRawOriginal('loader');
            $paths[] = $media->getRawOriginal('footer_image');
        }

        $relative = [];
        foreach (array_filter($paths) as $path) {
            $normalized = $this->normalizeToRelativePath($path);
            if ($normalized) {
                $relative[] = $normalized;
            }
        }

        return array_unique($relative);
    }

    /**
     * Every media path inside a page's widget list.
     *
     * Walks the whole structure rather than naming each widget's fields, so a
     * widget added later is covered without touching this command.
     *
     * @return list<string>
     */
    private function pathsInBlocks(mixed $blocks): array
    {
        if (! is_array($blocks)) {
            return [];
        }

        $found = [];
        $keys = ['url', 'poster', 'image', 'src', 'video_url'];

        array_walk_recursive($blocks, function ($value, $key) use (&$found, $keys) {
            if (! is_string($value) || $value === '' || ! in_array($key, $keys, true)) {
                return;
            }

            // Skip anything hosted elsewhere — YouTube and Drive links live in
            // the same fields and are not files on this server. Absolute URLs
            // that do point here still resolve, because normalizeToRelativePath
            // reduces them to a path and checks the file exists.
            if (preg_match('#^(https?:)?//#i', $value) && ! str_contains($value, '/assets/') && ! str_contains($value, '/uploads/')) {
                return;
            }

            $found[] = $value;
        });

        return $found;
    }

    private function normalizeToRelativePath(string $value): ?string
    {
        $parsed = parse_url($value, PHP_URL_PATH) ?: $value;
        $relative = ltrim($parsed, '/');

        if (! file_exists(public_path($relative))) {
            return null;
        }

        return $relative;
    }

    private function importPath(string $relativePath): bool
    {
        $fullPath = public_path($relativePath);
        if (! file_exists($fullPath)) {
            return false;
        }

        if (MediaLibraryItem::where('path', $relativePath)->exists()) {
            return false;
        }

        return (bool) app(MediaLibraryRegistrar::class)->register($relativePath);
    }
}
