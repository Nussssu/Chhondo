<?php

namespace App\Http\Requests\Admin\Manage_site;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateSiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'app_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'store_gateway_image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:10240',
            'store_gateway_image_library_path' => 'nullable|string',
            'store_email' => 'nullable|email',
            'support_hours' => 'nullable|string|max:255',
            'map_embed_url' => 'nullable|url|max:500',
            'facebook_url' => 'nullable|url',
            'facebook_active' => 'nullable|boolean',
            'tiktok_url' => 'nullable|url',
            'tiktok_active' => 'nullable|boolean',
            'youtube_url' => 'nullable|url',
            'youtube_active' => 'nullable|boolean',
            'instagram_url' => 'nullable|url',
            'instagram_active' => 'nullable|boolean',
            'x_url' => 'nullable|url',
            'x_active' => 'nullable|boolean',
            'shipping_charge_inside_dhaka' => 'nullable|numeric|min:0',
            'shipping_charge_outside_dhaka' => 'nullable|numeric|min:0',
            'free_shipping_enabled' => 'nullable|boolean',
            'free_shipping_mode' => ['nullable', \Illuminate\Validation\Rule::in(\App\Models\SiteInfo::FREE_SHIPPING_MODES)],
            // Required only for the threshold mode, where a missing figure would
            // silently waive nothing at all.
            'free_shipping_min_amount' => [
                'nullable', 'numeric', 'min:0.01',
                'required_if:free_shipping_mode,' . \App\Models\SiteInfo::FREE_SHIPPING_MINIMUM,
            ],
            'mainColor' => 'nullable|string',
            'secondColor' => 'nullable|string',
            'cart_bg' => 'nullable|string',
            'order_now_bg' => 'nullable|string',
            'call_now_bg' => 'nullable|string',
            'whatsapp_bg' => 'nullable|string',
            'footer_text' => 'nullable|string|max:500',
            'group_link' => 'nullable|string|max:500',
        ];
        

    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */

    public function messages(): array
    {
        return [
            'app_name.required' => 'App Name is required',
            'phone_number.required' => 'Phone Number is required',
            'whatsapp_number.required' => 'Whatsapp Number is required',
        ];
    }

}