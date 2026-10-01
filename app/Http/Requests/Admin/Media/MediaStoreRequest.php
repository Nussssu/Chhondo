<?php

namespace App\Http\Requests\Admin\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:1024',
            'loader' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp',
            'footer_image' => 'nullable|image|mimes:png,jpg,jpeg,webp',
            'logo_library_path' => 'nullable|string',
            'favicon_library_path' => 'nullable|string',
            'loader_library_path' => 'nullable|string',
            'footer_image_library_path' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'logo.image' => 'The logo must be an image.',
            'logo.mimes' => 'The logo must be a file of type: jpeg, png, jpg, gif, webp.',
            'logo.max' => 'The logo may not be greater than 2048 kilobytes.',
            'favicon.image' => 'The favicon must be an image.',
            'favicon.mimes' => 'The favicon must be a file of type: jpeg, png, jpg, gif, webp.',
            'favicon.max' => 'The favicon may not be greater than 1024 kilobytes.',
            'loader.image' => 'The loader must be an image.',
            'loader.mimes' => 'The loader must be a file of type: jpeg, png, jpg, gif, webp.',
            'loader.max' => 'The loader may not be greater than 2048 kilobytes.',
            'footer_image.image' => 'The footer image must be an image.',
            'footer_image.mimes' => 'The footer image must be a file of type: png, jpg, jpeg, webp.',
            'footer_image.max' => 'The footer image may not be greater than 2048 kilobytes.',
        ];
    }


}
