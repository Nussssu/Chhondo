<?php

namespace App\Services\Admin\Media;

use App\Repositories\Admin\Media\MediaRepository;
use App\Services\ImageUploadService;
use App\Models\Media;

class MediaService
{
    protected $mediaRepository;
    protected $imageUploadService;

    public function __construct(MediaRepository $mediaRepository, ImageUploadService $imageUploadService)
    {
        $this->mediaRepository = $mediaRepository;
        $this->imageUploadService = $imageUploadService;
    }

    public function storeMedia($data)
    {
        $existingMedia = Media::first(); // Assuming a single-row table

        $mediaData = [];

        // Each field accepts either a fresh upload or a path picked from the
        // media library. A direct upload wins when both are present.
        foreach (['logo', 'favicon', 'loader', 'footer_image'] as $field) {
            $libraryPath = $data["{$field}_library_path"] ?? null;

            if (isset($data[$field])) {
                $newValue = $this->imageUploadService->uploadImage($data[$field], 'media');
            } elseif ($libraryPath) {
                $newValue = $libraryPath;
            } else {
                continue;
            }

            if (! $newValue) {
                continue;
            }

            if ($existingMedia && $existingMedia->{$field}) {
                $this->imageUploadService->deleteFileUnlessInLibrary($existingMedia->{$field});
            }

            $mediaData[$field] = $newValue;
        }

        return $this->mediaRepository->storeMedia($mediaData);
    }

    public function getMedia()
    {
        return $this->mediaRepository->getMedia();
    }


    public function get($column)
    {
        return $this->mediaRepository->get($column);
    }
}
