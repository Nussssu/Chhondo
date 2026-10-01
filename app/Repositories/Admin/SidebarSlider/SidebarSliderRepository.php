<?php

namespace App\Repositories\Admin\SidebarSlider;

use App\Models\SidebarSlider;
use App\Services\ImageUploadService;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SidebarSliderRepository implements SidebarSliderRepositoryInterface
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }



    public function store($request)
    {
        try {
            $desktop = $this->resolveImage($request, 'image_path');

            if (! $desktop) {
                return null;
            }

            $slider = new SidebarSlider();
            $slider->image_path = $desktop;
            $slider->mobile_image_path = $this->resolveImage($request, 'mobile_image_path');
            $slider->save();

            return $slider;
        } catch (Exception $e) {
            Log::error('Error in storing sidebar slider: ' . $e->getMessage());

            return null;
        }
    }

    public function update($request, $id)
    {
        try {
            $slider = SidebarSlider::findOrFail($id);

            // Each image is independent: replacing the desktop one must not
            // clear a mobile version that was not touched, and vice versa.
            foreach (['image_path', 'mobile_image_path'] as $field) {
                $incoming = $this->resolveImage($request, $field);

                if (! $incoming) {
                    continue;
                }

                // getAttributes() reads the stored value; the accessor would
                // hand back a leading-slash path the library check would miss.
                $existing = $slider->getAttributes()[$field] ?? null;

                if ($existing && $request->hasFile($field)) {
                    $this->imageUploadService->deleteFileUnlessInLibrary($existing);
                }

                $slider->{$field} = $incoming;
            }

            $slider->save();

            return $slider;
        } catch (Exception $e) {
            Log::error('Error in updating sidebar slider: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * The stored path for one image slot — an upload, or a pick from the media
     * library. Null means the slot was left alone.
     */
    private function resolveImage($request, string $field): ?string
    {
        if ($request->hasFile($field)) {
            return $this->imageUploadService->uploadImage($request->file($field), 'slider') ?: null;
        }

        $libraryField = $field . '_library_path';

        return $request->filled($libraryField)
            ? $request->input($libraryField)
            : null;
    }

    public function delete($id)
    {
        $slider = SidebarSlider::findorFail($id);

        foreach (['image_path', 'mobile_image_path'] as $field) {
            $stored = $slider->getAttributes()[$field] ?? null;

            if ($stored) {
                $this->imageUploadService->deleteFileUnlessInLibrary($stored);
            }
        }

        $slider->delete();
    }

    public function get()
    {
       

        return SidebarSlider::latest()->get();
    }

    public function getById($id)
    {
        return SidebarSlider::find($id);
    }
}
