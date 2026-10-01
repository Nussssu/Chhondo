<?php

namespace App\Http\Requests\Admin\Blog;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Modify as needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Get the ID of the blog being updated, use the correct route key name
        $blogId = $this->route('blog') ? $this->route('blog') : null;

        $hasLibraryImage = $this->filled('image_library_path');

        return [
            'image' => ($blogId || $hasLibraryImage)
                ? ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'] // Optional for updates
                : ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Required for creation
            'image_library_path' => ['nullable', 'string'],
            'title' => 'required|string|max:255',
            // The post's public address. Editable on an existing post so it can
            // be corrected; new posts get one generated from the title.
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogs,slug,' . $blogId],
            'category_id' => 'required|exists:blog_categories,id', // Ensure category exists in the database
            'tags' => 'nullable|array', // Ensure 'tags' is an array if provided
            'tags.*' => 'nullable|string|max:255', // Validate each tag within the array
            'description' => 'nullable|string',
            'status' => 'nullable|in:Published,Draft',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ];
    }

    /**
     * Customize error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'The image field is required.',
            'image.image' => 'The uploaded file must be a valid image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
            'image.max' => 'The image size must not exceed 2MB.',
            'title.required' => 'Please provide a title for the blog.',
            'title.max' => 'The title must not exceed 255 characters.',
            'category_id.required' => 'Please select a category for the blog.',
            'category_id.exists' => 'The selected category is invalid.',
            'tags.array' => 'Tags must be an array.',
            'tags.*.string' => 'Each tag must be a valid string.',
            'tags.*.max' => 'Each tag must not exceed 255 characters.',
            'description.string' => 'The description must be a valid string.',
            'meta_title.max' => 'The meta title must not exceed 255 characters.',
            'meta_description.string' => 'The meta description must be a valid string.',
        ];
    }
}
