<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaLibraryItem extends Model
{
    protected $appends = ['url', 'filename', 'extension', 'human_size'];

    protected $fillable = [
        'path',
        'kind',
        'title',
        'alt_text',
        'description',
        'mime_type',
        'size',
        'width',
        'height',
        'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute(): string
    {
        return '/' . ltrim($this->path, '/');
    }

    public function getFilenameAttribute(): string
    {
        return basename($this->path);
    }

    public function getExtensionAttribute(): string
    {
        return strtoupper(pathinfo($this->path, PATHINFO_EXTENSION));
    }

    public function getHumanSizeAttribute(): ?string
    {
        $bytes = $this->size;

        if (! $bytes) {
            return null;
        }

        if ($bytes < 1024) {
            return "{$bytes} B";
        }

        $value = $bytes / 1024;
        foreach (['KB', 'MB', 'GB'] as $unit) {
            if ($value < 1024 || $unit === 'GB') {
                return round($value, $value < 10 ? 1 : 0) . ' ' . $unit;
            }
            $value /= 1024;
        }

        return "{$bytes} B";
    }
}
