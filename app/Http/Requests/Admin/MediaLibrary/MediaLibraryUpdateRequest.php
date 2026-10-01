<?php

namespace App\Http\Requests\Admin\MediaLibrary;

use Illuminate\Foundation\Http\FormRequest;

class MediaLibraryUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
        ];
    }
}
