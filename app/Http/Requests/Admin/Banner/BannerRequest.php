<?php

namespace App\Http\Requests\Admin\Banner;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
{
    /** Anything narrower than this looks soft stretched across a desktop hero. */
    private const MIN_DESKTOP_WIDTH = 1200;

    /** The mobile slot is square, so a small image is upscaled and looks poor. */
    private const MIN_MOBILE_WIDTH = 600;

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $mimes = 'mimes:jpeg,png,jpg,gif,svg,webp';

        // Either an upload or a library pick satisfies the desktop image; on an
        // update neither is required, because only the mobile one may be changing.
        $desktopSupplied = $this->filled('image_path_library_path') || $this->hasFile('image_path');
        $desktopRequired = ! $desktopSupplied && ! $this->isUpdate();

        return [
            'image_path' => ($desktopRequired ? 'required' : 'nullable')
                . "|image|{$mimes}|dimensions:min_width=" . self::MIN_DESKTOP_WIDTH,
            'image_path_library_path' => 'nullable|string',

            // Optional everywhere: without it the desktop image is used on phones too.
            'mobile_image_path' => "nullable|image|{$mimes}|dimensions:min_width=" . self::MIN_MOBILE_WIDTH,
            'mobile_image_path_library_path' => 'nullable|string',

            // Carousel details: alt text, where a click goes, and on/off.
            'title'        => 'nullable|string|max:150',
            'link_url'     => 'nullable|string|max:500',
            'link_new_tab' => 'nullable|boolean',
            'is_active'    => 'nullable|boolean',
            'heading'      => 'nullable|string|max:1000',
            'subtext'      => 'nullable|string|max:255',
            'cta_label'    => 'nullable|string|max:150',
            'cta_url'      => ['nullable', 'string', 'max:500', function ($attribute, $value, $fail) {
                if ($value && ! preg_match('#^(?:/(?!/)|https?://)#i', $value)) {
                    $fail('Use a site path such as /shop or an http/https link.');
                }
            }],
            'show_subtext' => 'nullable|boolean',
            'show_cta'     => 'nullable|boolean',
        ];
    }

    private function isUpdate(): bool
    {
        return $this->isMethod('PATCH')
            || $this->isMethod('PUT')
            || strtoupper((string) $this->input('_method')) === 'PATCH';
    }

    public function messages()
    {
        return [
            'image_path.required'   => 'Choose a banner image for desktop.',
            'image_path.image'      => 'The desktop banner must be an image file.',
            'image_path.mimes'      => 'The desktop banner must be a jpeg, png, jpg, gif, svg or webp.',
            'image_path.dimensions' => 'The desktop banner must be at least ' . self::MIN_DESKTOP_WIDTH . 'px wide. 1900×560 is the ideal size.',

            'mobile_image_path.image'      => 'The mobile banner must be an image file.',
            'mobile_image_path.mimes'      => 'The mobile banner must be a jpeg, png, jpg, gif, svg or webp.',
            'mobile_image_path.dimensions' => 'The mobile banner must be at least ' . self::MIN_MOBILE_WIDTH . 'px wide. A square image such as 1000×1000 works best.',
        ];
    }
}
