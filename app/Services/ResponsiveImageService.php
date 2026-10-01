<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Intervention\Image\Laravel\Facades\Image;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

/**
 * Narrower copies of an uploaded image, so a phone downloads a phone-sized
 * file instead of the full-resolution one.
 *
 * Uploads are stored at whatever dimensions they arrive at — product photos
 * sit at 1000x1500 and ~250KB while the card showing them is 200px tall on a
 * phone. The home page was shipping 4MB of images for a grid of thumbnails.
 *
 * A variant lives beside its original with the width in the name:
 *
 *     uploads/abc.webp        the original, capped at MAX_WIDTH
 *     uploads/abc-480.webp    the 480px-wide copy
 *
 * The front end builds its srcset from that convention alone, so **every
 * width in WIDTHS must exist for every image**. A srcset candidate that 404s
 * does not fall back to `src` — the browser renders a broken image. That is
 * why generateVariants() never skips a width: one narrower than the source is
 * copied rather than upscaled, so the URL is always real.
 */
class ResponsiveImageService
{
    /**
     * Widths to generate, chosen for what the storefront actually paints: a
     * product card is ~170px on a phone and ~350px on desktop, so 320 and 480
     * cover 1x and 2x there, and the larger two cover the product page's main
     * image and the hero banner.
     */
    public const WIDTHS = [320, 480, 768, 1024];

    /** Nothing on the storefront paints wider than this, so originals are capped here. */
    public const MAX_WIDTH = 1400;

    /** Re-encode quality for generated variants. */
    private const QUALITY = 78;

    /**
     * Shrink an already-saved image to MAX_WIDTH, in place.
     *
     * scaleDown() never enlarges, so a 300px logo is left alone rather than
     * being blown up into a blurry 1400px one.
     *
     * @return bool whether the file was rewritten
     */
    public function capOriginal(string $fullPath): bool
    {
        $temporaryPath = null;

        try {
            $img = Image::decode($fullPath);

            if ($img->width() <= self::MAX_WIDTH) {
                return false;
            }

            // Written beside the original first, because re-encoding does not
            // always pay: an already well-compressed webp came out *larger*
            // after being scaled down and encoded again. The original is only
            // replaced when the smaller image is also the smaller file, so
            // this can never make a page heavier or a picture worse.
            // The extension has to be the real one: Intervention picks its
            // encoder from it, and a ".capping" suffix made save() fail, which
            // silently left a 917KB banner uncapped. Dot-prefixed so Symfony
            // Finder (which ignores dot files) cannot mistake it for an upload
            // if anything interrupts us mid-write.
            $directory = pathinfo($fullPath, PATHINFO_DIRNAME);
            $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
            $temporaryPath = $directory . '/.' . pathinfo($fullPath, PATHINFO_FILENAME) . '.capping.' . $extension;

            $img->scaleDown(width: self::MAX_WIDTH)->save($temporaryPath, quality: self::QUALITY);
            $this->optimize($temporaryPath);

            clearstatcache(true, $temporaryPath);
            clearstatcache(true, $fullPath);

            if (filesize($temporaryPath) >= filesize($fullPath)) {
                unlink($temporaryPath);

                return false;
            }

            rename($temporaryPath, $fullPath);

            return true;
        } catch (\Throwable $e) {
            if ($temporaryPath !== null && is_file($temporaryPath)) {
                @unlink($temporaryPath);
            }

            Log::warning("Could not cap image {$fullPath}: {$e->getMessage()}");

            return false;
        }
    }

    /**
     * Write a copy of this image at every width in WIDTHS.
     *
     * No width is ever skipped — see the class docblock. A width at or above
     * the source's own width copies the file byte for byte: same pixels, no
     * re-encode, no quality loss, and the URL the srcset advertises exists.
     *
     * @param bool $force rewrite variants that already exist
     * @return array<int,string> paths written, keyed by width
     */
    public function generateVariants(string $fullPath, bool $force = false): array
    {
        $written = [];

        if (! is_file($fullPath)) {
            return $written;
        }

        try {
            $sourceWidth = Image::decode($fullPath)->width();
        } catch (\Throwable $e) {
            Log::warning("Could not read image {$fullPath}: {$e->getMessage()}");

            return $written;
        }

        foreach (self::WIDTHS as $width) {
            $variantPath = $this->variantPath($fullPath, $width);

            if (! $force && is_file($variantPath)) {
                continue;
            }

            try {
                if ($width >= $sourceWidth) {
                    copy($fullPath, $variantPath);
                } else {
                    Image::decode($fullPath)
                        ->scaleDown(width: $width)
                        ->save($variantPath, quality: self::QUALITY);

                    $this->optimize($variantPath);
                }

                $written[$width] = $variantPath;
            } catch (\Throwable $e) {
                Log::warning("Could not write {$width}px variant of {$fullPath}: {$e->getMessage()}");
            }
        }

        return $written;
    }

    /** Cap the original and write its variants — what every upload path wants. */
    public function process(string $fullPath): void
    {
        $this->capOriginal($fullPath);
        $this->generateVariants($fullPath);
    }

    /** "…/abc.webp" + 480 => "…/abc-480.webp" */
    public function variantPath(string $fullPath, int $width): string
    {
        $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
        $withoutExtension = substr($fullPath, 0, -(strlen($extension) + 1));

        return "{$withoutExtension}-{$width}.{$extension}";
    }

    /**
     * The reverse: "…/abc-480.webp" => ["…/abc.webp", 480], or null when the
     * name is not one of ours.
     *
     * An original that merely ends in digits ("banner-2024.webp") is not a
     * variant, which is why the width must be one we actually generate.
     *
     * @return array{0:string,1:int}|null
     */
    public function parseVariantPath(string $path): ?array
    {
        $extension = pathinfo($path, PATHINFO_EXTENSION);

        if (! preg_match('/^(.*)-(\d+)$/', pathinfo($path, PATHINFO_FILENAME), $matches)) {
            return null;
        }

        $width = (int) $matches[2];

        if (! in_array($width, self::WIDTHS, true)) {
            return null;
        }

        return [pathinfo($path, PATHINFO_DIRNAME) . "/{$matches[1]}.{$extension}", $width];
    }

    /**
     * Spatie's optimizer shells out to cwebp and friends, so a host without
     * those binaries must not take an upload down with it.
     */
    private function optimize(string $fullPath): void
    {
        try {
            ImageOptimizer::optimize($fullPath);
        } catch (\Throwable $e) {
            Log::debug("ImageOptimizer skipped {$fullPath}: {$e->getMessage()}");
        }
    }
}
