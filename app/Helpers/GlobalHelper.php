
<?php

use App\Models\Media;
use App\Services\Admin\Manage_site\SiteService;
use App\Services\Admin\Media\MediaService;
use Illuminate\Support\Facades\DB;

function getFirstMedia()
{
    return Media::first();
}

if (!function_exists('ordinal')) {
    function ordinal($number)
    {
        $suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
        if (($number % 100) >= 11 && ($number % 100) <= 13) {
            return $number . 'th';
        }
        return $number . $suffixes[$number % 10];
    }
}

/** Set sidebar active **/

if (! function_exists('setSidebarActive')) {
    function setSidebarActive(array $routes): ?String
    {
        foreach ($routes as $route) {
            if (request()->routeIs($route)) {
                return 'mm-active';
            }
        }
        return null;
    }
}
if (! function_exists('fileContent')) {
    function fileContent($path)
    {
        if (! file_exists($path)) {
            return null; // or throw an exception, or return a placeholder
        }

        return trim(file_get_contents($path));
    }
}

if (! function_exists('getApiSetting')) {
    function getApiSetting($column)
    {
        return DB::table('couriar_api_settings')->value($column);
    }
}

if (! function_exists('getMedia')) {
    function getMedia($column)
    {
        return app(MediaService::class)->get($column);
    }
}

if (! function_exists('siteInfo')) {
    function siteInfo($key)
    {
        return app(SiteService::class)->get($key);
    }
}

/** check permission */
if (! function_exists('canAccess')) {
    function canAccess(array $permissions): bool
    {
        $permission = auth()->guard('web')->user()->hasAnyPermission($permissions);
        $superAdmin = auth()->guard('web')->user()->hasRole('Super Admin');
        if ($permission || $superAdmin) {
            return true;
        }
        return false;
    }
}
