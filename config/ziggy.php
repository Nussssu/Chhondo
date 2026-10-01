<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Route groups
    |--------------------------------------------------------------------------
    |
    | @routes writes the route list into the page as inline JSON, so it is
    | re-sent uncompressed on every request and can never be cached. Unfiltered
    | that is ~24KB per page, and 156 of the 277 named routes are admin ones
    | the storefront can never call.
    |
    | app.blade.php asks for the "storefront" group. admin_root.blade.php is
    | behind a login and still takes the full list, so nothing in the panel
    | needs auditing for a route that went missing.
    |
    | A group whose patterns all begin with "!" is a rejection list, so this
    | stays correct as the storefront grows: only new admin.* routes are
    | excluded and everything else is included by default.
    |
    */

    'groups' => [
        'storefront' => ['!admin.*'],
    ],

];
