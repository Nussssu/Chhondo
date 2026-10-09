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
            // A new banner joins the end of the carousel.
            $slider->sort_order = (int) SidebarSlider::max('sort_order') + 1;
            $this->fillDetails($slider, $request);
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

            $this->fillDetails($slider, $request);
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

    /** Alt text, link and on/off — only the ones the request carries. */
    private function fillDetails(SidebarSlider $slider, $request): void
    {
        foreach (['title', 'link_url', 'heading', 'subtext', 'cta_label', 'cta_url'] as $field) {
            if ($request->has($field)) {
                $slider->{$field} = trim((string) $request->input($field)) ?: null;
            }
        }

        foreach (['link_new_tab', 'is_active', 'show_subtext', 'show_cta'] as $field) {
            if ($request->has($field)) {
                $slider->{$field} = $request->boolean($field);
            }
        }
    }

    /** Save a new carousel order: the ids, first to last. */
    public function reorder(array $ids): void
    {
        foreach (array_values($ids) as $i => $id) {
            SidebarSlider::whereKey((int) $id)->update(['sort_order' => $i + 1]);
        }
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
       

        return SidebarSlider::ordered()->get();
    }

    public function getById($id)
    {
        return SidebarSlider::find($id);
    }
}
