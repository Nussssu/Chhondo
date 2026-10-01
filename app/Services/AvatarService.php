<?php

namespace App\Services;

class AvatarService
{
    public function getAvatar($image, $name)
    {
        if (!empty($image) && file_exists(public_path($image))) {
            return asset($image);
        }

        $initials = urlencode(mb_substr(trim($name), 0, 2));
        return "https://ui-avatars.com/api/?name={$initials}&background=random&color=fff&size=64";
    }
}