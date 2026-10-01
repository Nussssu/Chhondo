<?php

namespace App\Services;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Review;
use App\Models\SidebarSlider;
use App\Models\SiteInfo;
use App\Models\Transaction;
use App\Models\User;

/**
 * Answers "what is still using this file?".
 *
 * Records reference assets by path rather than by foreign key, so the only way
 * to know whether a file is in use is to scan the columns that hold paths. The
 * library uses this to show usage on an item and to warn before deleting one;
 * media:prune-unused uses it to find files nothing points at.
 */
class MediaUsageService
{
    /** @var array<string, array<int, array{type: string, label: string, id: int|null}>>|null */
    private ?array $map = null;

    public function __construct(protected MediaLibraryRegistrar $registrar)
    {
    }

    /**
     * Every referenced path mapped to the records referencing it. Built once
     * per instance — callers annotating a page of results reuse the same scan.
     *
     * @return array<string, array<int, array{type: string, label: string, id: int|null}>>
     */
    public function map(): array
    {
        return $this->map ??= $this->build();
    }

    /**
     * @return array<int, array{type: string, label: string, id: int|null}>
     */
    public function usageFor(?string $urlOrPath): array
    {
        $relative = $this->registrar->toRelativePath($urlOrPath);

        return $relative ? ($this->map()[$relative] ?? []) : [];
    }

    public function isUsed(?string $urlOrPath): bool
    {
        return $this->usageFor($urlOrPath) !== [];
    }

    /** @return array<int, string> */
    public function referencedPaths(): array
    {
        return array_keys($this->map());
    }

    private function build(): array
    {
        $map = [];

        $add = function ($value, string $type, ?string $label, $id) use (&$map) {
            if (! is_string($value) || $value === '') {
                return;
            }

            $relative = $this->registrar->toRelativePath($value);
            if (! $relative) {
                return;
            }

            $map[$relative][] = [
                'type' => $type,
                'label' => $label ?: '(untitled)',
                'id' => $id,
            ];
        };

        Product::query()->select('id', 'product_name', 'featured_image', 'gallery_images', 'video')
            ->chunk(200, function ($rows) use ($add) {
                foreach ($rows as $r) {
                    $add($r->getRawOriginal('featured_image'), 'Product', $r->product_name, $r->id);
                    $add($r->getRawOriginal('video'), 'Product', $r->product_name, $r->id);

                    $gallery = $r->getRawOriginal('gallery_images');
                    $decoded = is_string($gallery) ? json_decode($gallery, true) : $gallery;
                    foreach (is_array($decoded) ? $decoded : [] as $entry) {
                        $add($entry, 'Product', $r->product_name, $r->id);
                    }
                }
            });

        Blog::query()->select('id', 'title', 'image')->chunk(200, function ($rows) use ($add) {
            foreach ($rows as $r) {
                $add($r->getRawOriginal('image'), 'Blog', $r->title, $r->id);
            }
        });

        Category::query()->select('id', 'name', 'image')->chunk(200, function ($rows) use ($add) {
            foreach ($rows as $r) {
                $add($r->getRawOriginal('image'), 'Category', $r->name, $r->id);
            }
        });

        Review::query()->select('id', 'name', 'image')->chunk(200, function ($rows) use ($add) {
            foreach ($rows as $r) {
                $add($r->getRawOriginal('image'), 'Review', $r->name, $r->id);
            }
        });

        User::query()->select('id', 'name', 'image')->chunk(200, function ($rows) use ($add) {
            foreach ($rows as $r) {
                $add($r->getRawOriginal('image'), 'User', $r->name, $r->id);
            }
        });

        ProductReview::query()->select('id', 'name', 'images')->chunk(200, function ($rows) use ($add) {
            foreach ($rows as $r) {
                foreach ($r->images ?? [] as $image) {
                    $add($image, 'Product review', $r->name, $r->id);
                }
            }
        });

        if (class_exists(Transaction::class)) {
            Transaction::query()->select('id', 'document')->chunk(200, function ($rows) use ($add) {
                foreach ($rows as $r) {
                    $add($r->getRawOriginal('document'), 'Transaction', '#' . $r->id, $r->id);
                }
            });
        }

        if (class_exists(SidebarSlider::class)) {
            SidebarSlider::query()->select('id', 'image_path')->chunk(200, function ($rows) use ($add) {
                foreach ($rows as $r) {
                    $add($r->getRawOriginal('image_path'), 'Banner', '#' . $r->id, $r->id);
                }
            });
        }

        if (class_exists(SiteInfo::class)) {
            SiteInfo::query()->select('id', 'store_gateway_image')->chunk(200, function ($rows) use ($add) {
                foreach ($rows as $r) {
                    $add($r->getRawOriginal('store_gateway_image'), 'Site settings', 'Store gateway image', $r->id);
                }
            });
        }

        $media = Media::first();
        if ($media) {
            foreach (['logo' => 'Logo', 'favicon' => 'Favicon', 'loader' => 'Loader', 'footer_image' => 'Footer image'] as $field => $label) {
                $add($media->getRawOriginal($field), 'Site settings', $label, $media->id);
            }
        }

        return $map;
    }
}
