<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Cache;

class Media extends Model
{
    use HasFactory;

    protected $fillable = ['logo', 'favicon', 'loader', 'footer_image'];

    public function getLogoAttribute($value)         { return $this->toUrl($value); }
    public function getFaviconAttribute($value)      { return $this->toUrl($value); }
    public function getLoaderAttribute($value)       { return $this->toUrl($value); }
    public function getFooterImageAttribute($value)  { return $this->toUrl($value); }

    private function toUrl($value)
    {
        if (! $value) {
            return null;
        }
        if (preg_match('#^https?://#i', $value)) {
            $value = parse_url($value, PHP_URL_PATH) ?? $value;
        }
        return '/' . ltrim($value, '/');
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($media) {
           
            foreach ($media->getDirty() as $column => $value) {
                Cache::forget("media_{$column}");
            }
        });
    }
}
