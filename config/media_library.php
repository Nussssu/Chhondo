<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Maximum upload size (kilobytes)
    |--------------------------------------------------------------------------
    |
    | Applies to media library uploads. Images were previously capped at 5 MB,
    | partly because everything is stored on the application server under
    | public/ rather than in object storage. Video needs a much larger ceiling,
    | so the cap lives here where it can be tuned per environment.
    |
    | Note this is only the application-level limit — PHP's upload_max_filesize
    | and post_max_size still apply, and the web server may impose its own.
    |
    */

    'max_upload_kb' => env('MEDIA_LIBRARY_MAX_UPLOAD_KB', 51200), // 50 MB

];
