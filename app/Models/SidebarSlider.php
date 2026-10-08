<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SidebarSlider extends Model
{
    use HasFactory;

    protected $fillable = ['image_path', 'mobile_image_path', 'sort_order', 'title', 'link_url', 'link_new_tab', 'is_active'];

    protected $casts = [
        'sort_order'   => 'integer',
        'link_new_tab' => 'boolean',
        'is_active'    => 'boolean',
    ];

    /** Carousel order: the admin's sequence, newest first among equals. */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('id');
    }

    protected $appends = ['mobile_or_desktop_image'];

    public function getImagePathAttribute($value)
    {
        return $this->normalisePath($value);
    }

    public function getMobileImagePathAttribute($value)
    {
        return $this->normalisePath($value);
    }

    /**
     * What a phone should show: the square crop when one was uploaded, and the
     * desktop image otherwise, so a banner without a mobile version still
     * appears rather than leaving a gap.
     */
    public function getMobileOrDesktopImageAttribute(): ?string
    {
        return $this->mobile_image_path ?: $this->image_path;
    }

    /**
     * Root-relative, so an absolute URL saved against a different environment
     * cannot leave the browser resolving a host that does not exist here.
     */
    private function normalisePath(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        if (preg_match('#^https?://#i', $value)) {
            $value = parse_url($value, PHP_URL_PATH) ?? $value;
        }

        return '/' . ltrim($value, '/');
    }
}
