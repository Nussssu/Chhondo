<?php

namespace App\Repositories\Admin\Media;

use App\Models\Media;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;


class MediaRepository
{
    /**
     * Save the shop's logo, favicon, loader and footer image.
     *
     * The media table holds exactly one row. This used to be
     * updateOrCreate(['id' => 1], $data), which fails twice over: `id` is not
     * fillable, so it was dropped from the create, and the lookup only matched
     * a row that happened to have id 1. On a table whose row had any other id,
     * every save inserted a fresh row while every reader kept calling
     * Media::first() and getting the original — so a favicon or logo set in
     * the admin was written to the database and never appeared on the site.
     */
    public function storeMedia($data)
    {
        $media = Media::query()->orderBy('id')->first();

        if ($media) {
            $media->fill($data)->save();
        } else {
            $media = Media::create($data);
        }

        // Invalidate cache for updated keys
        foreach ($data as $key => $value) {
            Cache::forget("media_{$key}");

        }

        return $media;
    }

    public function getMedia()
    {
        return Media::first();
    }

    public function get($column)
    {
        // Check if the column exists in the 'media' table
        if (!Schema::hasColumn('media', $column)) {
            throw new \Exception("The column '{$column}' does not exist in the media table.");
        }

        // Retrieve and cache the value for the specified column.
        //
        // Read through the model, not ->value(), so the accessor runs. Uploads
        // are stored as an absolute URL with the host baked in, and a row
        // written on another domain (or in dev) otherwise hands callers a link
        // to a host that does not exist here — asset() passes an absolute URL
        // straight through, so the image simply fails to load.
        return Cache::remember("media_{$column}", now()->addHours(24), function () use ($column) {
            return Media::query()->orderBy('id')->first()?->{$column};
        });
    }
}
