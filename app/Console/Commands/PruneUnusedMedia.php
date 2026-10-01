<?php

namespace App\Console\Commands;

use App\Models\MediaLibraryItem;
use App\Services\MediaUsageService;
use Illuminate\Console\Command;

/**
 * Uploads are registered in the media library, and records no longer delete
 * files when an image is replaced — a file may be referenced from several
 * places, so the library owns it and record edits only drop the reference.
 * That means replaced files accumulate. This command finds the ones nothing
 * points at any more.
 *
 * Dry run by default: it never deletes without --force.
 */
class PruneUnusedMedia extends Command
{
    protected $signature = 'media:prune-unused
                            {--force : Actually delete the files and their library rows}
                            {--limit=0 : Only process the first N unreferenced items}';

    protected $description = 'List (or delete) media library items no longer referenced by any record';

    public function handle(MediaUsageService $usageService): int
    {
        $referenced = $usageService->referencedPaths();

        $this->info(sprintf('%d referenced path(s) found across content tables.', count($referenced)));

        $query = MediaLibraryItem::query()->whereNotIn('path', array_values($referenced));

        $limit = (int) $this->option('limit');
        if ($limit > 0) {
            $query->limit($limit);
        }

        $unused = $query->get();

        if ($unused->isEmpty()) {
            $this->info('Nothing to prune — every library item is still in use.');

            return self::SUCCESS;
        }

        $force = (bool) $this->option('force');
        $bytes = 0;
        $deleted = 0;

        foreach ($unused as $item) {
            $fullPath = public_path($item->path);
            $size = file_exists($fullPath) ? (filesize($fullPath) ?: 0) : 0;
            $bytes += $size;

            if (! $force) {
                $this->line(sprintf('  would delete  %s  (%s)', $item->path, $this->humanBytes($size)));

                continue;
            }

            if (file_exists($fullPath) && is_writable($fullPath)) {
                @unlink($fullPath);
            }

            $item->delete();
            $deleted++;
        }

        if (! $force) {
            $this->newLine();
            $this->warn(sprintf(
                '%d unreferenced item(s), %s. This was a dry run — re-run with --force to delete.',
                $unused->count(),
                $this->humanBytes($bytes)
            ));

            return self::SUCCESS;
        }

        $this->info(sprintf('Pruned %d item(s), reclaiming %s.', $deleted, $this->humanBytes($bytes)));

        return self::SUCCESS;
    }

    private function humanBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return "{$bytes} B";
        }

        $units = ['KB', 'MB', 'GB'];
        $value = $bytes / 1024;

        foreach ($units as $unit) {
            if ($value < 1024 || $unit === 'GB') {
                return round($value, 1) . ' ' . $unit;
            }
            $value /= 1024;
        }

        return "{$bytes} B";
    }
}
