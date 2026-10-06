<?php

namespace App\Services;

class AvatarService
{
    public function getAvatar($image, $name)
    {
        if (!empty($image)) {
            // Stored values may be root-relative ("/users/x.webp"), relative
            // ("users/x.webp") or absolute URLs baked by asset()/url() at
            // upload time. Only local paths are checked on disk; absolute
            // URLs are returned untouched so valid images are not replaced
            // by the ui-avatars fallback.
            if (preg_match('#^https?://#i', $image)) {
                return $image;
            }
            $relative = ltrim($image, '/');
            if ($relative !== '' && file_exists(public_path($relative))) {
                return asset($relative);
            }
        }

        $initials = urlencode(mb_substr(trim($name), 0, 2));
        return "https://ui-avatars.com/api/?name={$initials}&background=random&color=fff&size=64";
    }
}