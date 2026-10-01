<?php

namespace App\Repositories\Admin\MediaLibrary;

use App\Models\MediaLibraryItem;

class MediaLibraryRepository
{
    public function paginate(?string $search, int $perPage = 24, ?array $kinds = null, ?string $period = null)
    {
        return MediaLibraryItem::query()
            ->with('uploader:id,name')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('alt_text', 'like', "%{$search}%")
                        ->orWhere('path', 'like', "%{$search}%");
                });
            })
            // A featured-image field must not be offered videos, so the picker
            // constrains the list to the kinds that field accepts.
            ->when($kinds, fn ($query) => $query->whereIn('kind', $kinds))
            // "YYYY-MM" — the month drop-down, matching how WordPress filters.
            ->when($period && preg_match('/^\d{4}-\d{2}$/', $period), function ($query) use ($period) {
                [$year, $month] = explode('-', $period);
                $query->whereYear('created_at', $year)->whereMonth('created_at', $month);
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /** Counts per kind, plus the months that have uploads, for the filter bar. */
    public function stats(): array
    {
        $counts = MediaLibraryItem::query()
            ->selectRaw('kind, count(*) as total')
            ->groupBy('kind')
            ->pluck('total', 'kind')
            ->all();

        $periods = MediaLibraryItem::query()
            ->orderByDesc('created_at')
            ->pluck('created_at')
            ->filter()
            ->map(fn ($date) => $date->format('Y-m'))
            ->unique()
            ->values()
            ->all();

        return [
            'counts' => [
                'all' => array_sum($counts),
                'image' => $counts['image'] ?? 0,
                'video' => $counts['video'] ?? 0,
                'document' => $counts['document'] ?? 0,
            ],
            'periods' => $periods,
        ];
    }

    public function create(array $data): MediaLibraryItem
    {
        return MediaLibraryItem::create($data);
    }

    public function findOrFail(int $id): MediaLibraryItem
    {
        return MediaLibraryItem::findOrFail($id);
    }

    public function update(MediaLibraryItem $item, array $data): MediaLibraryItem
    {
        $item->update($data);

        return $item;
    }

    public function delete(MediaLibraryItem $item): void
    {
        $item->delete();
    }

    public function firstOrCreateByPath(string $path, array $data): MediaLibraryItem
    {
        return MediaLibraryItem::firstOrCreate(['path' => $path], $data);
    }
}
