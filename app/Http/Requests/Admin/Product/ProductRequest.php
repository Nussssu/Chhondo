<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
    /**
     * Accepts the shapes each host actually produces — watch links, short
     * links, Shorts, and the /embed/ URL — plus a bare id for values saved
     * before links were accepted.
     */
    public static function videoLinkRule(?string $host): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail) use ($host) {
            $value = trim((string) $value);
            if ($value === '') {
                return;
            }

            if ($host === 'Youtube' && ! preg_match(
                '~(youtube\.com/(watch\?|embed/|shorts/)|youtu\.be/)|^[A-Za-z0-9_-]{11}$~i',
                $value
            )) {
                $fail('Enter a YouTube link, for example https://www.youtube.com/watch?v=xxxxxxxxxxx');
            }

            if ($host === 'Gdrive' && ! preg_match(
                '~drive\.google\.com/(file/d/|open\?id=)|^[A-Za-z0-9_-]{10,}$~i',
                $value
            )) {
                $fail('Enter a Google Drive share link, for example https://drive.google.com/file/d/…/view');
            }
        };
    }

    public function rules(): array
    {

        // Get the ID of the product being updated
        $productId = $this->route('product') ? $this->route('product')->id : null;

        return [
            'product_name' => ['required', 'string', 'max:255'],
            // 'product_code' => ['required', 'string', 'max:255', 'unique:products,product_code'],
            // The column is NOT NULL on MySQL, so a blank code failed as a server
            // error instead of a message. A code loaded from a purchase counts.
            'product_code' => ['required_without:purchase_product_code', 'nullable', 'string', 'max:255', 'unique:products,product_code,' . $productId],

            'purchase_product_code' => ['nullable', 'string', 'max:255', 'unique:products,product_code,' . $productId],

            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],

            'product_tag' => ['nullable', 'array'],
            'product_tag.*' => ['nullable', 'string'],

            'specification' => ['nullable', 'array'],
            'specification.*' => ['nullable', 'string'],

            // 'stock_option' => ['required', 'in:Manual,From Purchase'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            // instock / outofstock / preorder need no quantity; manage counts one.
            'stock_status' => ['nullable', \Illuminate\Validation\Rule::in(\App\Models\Product::STOCK_STATUSES)],
            // When the pre-ordered stock is expected, shown on the product page.
            'preorder_note' => ['nullable', 'string', 'max:500'],
            'stock_option' => ['nullable', 'in:Manual,From Purchase'],
            // One of the two must survive: `price` is NOT NULL, and leaving the
            // sale box empty promotes the price beside it (resolvePricePair).
            'price' => ['required_without:previous_price', 'nullable', 'numeric', 'min:0'],


            'previous_price' => [
                'required_without:price',
                'nullable',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    // Only compared when a sale price was actually given.
                    if ($value && $this->filled('price') && $value <= (float) $this->price) {
                        $fail('The sale price must be lower than the price.');
                    }
                },
            ],

            'has_blouse_option' => ['nullable', 'boolean'],
            // Optional even with the blouse option on: an option priced only at
            // its regular price still sells, at that price. See
            // Product::getBlousePriceAttribute().
            'price_with_blouse' => ['nullable', 'numeric', 'min:0.01'],

            // The struck-through price for the with-blouse option. Same rule as
            // previous_price: a "was" that is not higher is not a saving.
            'previous_price_with_blouse' => [
                'nullable',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    $sale = (float) $this->input('price_with_blouse');

                    // Only meaningful when a sale price was actually given.
                    if ($value && $sale > 0 && $value <= $sale) {
                        $fail('The sale price with blouse must be lower than the price with blouse.');
                    }
                },
            ],


            'attribute_prices' => ['nullable', 'array'],
            'attribute_prices.*' => ['nullable', 'numeric', 'min:0'],

            'attribute_quantities' => ['nullable', 'array'],
            'attribute_quantities.*' => ['nullable', 'integer', 'min:0'],



            // The form posts the full list; the first is the primary category,
            // which is what `category_id` ends up holding. That single field is
            // still accepted, for callers that predate the multi-select.
            'category_ids'   => ['required_without:category_id', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'category_id'    => ['required_without:category_ids', 'integer', 'exists:categories,id'],
            //'featured_image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            // Make featured_image optional if updating an existing product, or if an
            // existing media library image was chosen instead of a fresh upload.
            'featured_image' => [
                ($productId || $this->filled('featured_image_library_path')) ? 'nullable' : 'required',
                'image',
            ],
            'featured_image_library_path' => ['nullable', 'string'],
            'gallery_images.*' => ['nullable', 'image'],
            'gallery_images_existing' => ['nullable', 'array'],
            'gallery_images_existing.*' => ['nullable', 'string'],
            'note'=> ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            // Editable on an existing product so its public URL can be
            // corrected; the controller normalises whatever is typed.
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,' . $productId],
            'feature' => ['nullable'],
            'status' => ['nullable'],
            'is_home' => ['nullable','boolean'],
            'color_links' => ['nullable', 'array'],
            'color_links.*' => ['nullable', 'string'],
            'video_title' => ['nullable', 'string', 'max:255'],
            'video_section_title' => ['nullable', 'string', 'max:255'],
            // A link, not embed markup. Checked here so a wrong paste is caught
            // on save rather than discovered as a blank frame on the storefront.
            'video_link' => ['nullable', 'string', 'max:255', self::videoLinkRule($this->input('video_host'))],
            'sec_video_title' => ['nullable', 'string', 'max:255'],
            'video_host' => ['nullable', 'string', 'max:255'],
            // This was previously validated as a string, so any actual upload
            // was rejected before it reached the controller.
            'video' => ['nullable', 'file', 'mimes:mp4,webm,ogv,mov,m4v', 'max:' . config('media_library.max_upload_kb', 51200)],
            'video_library_path' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_code.required_without'   => 'Enter a product code.',
            'price.required_without'          => 'Enter a price.',
            'previous_price.required_without' => 'Enter a price.',
            'category_ids.required_without' => 'Choose at least one category.',
            'category_id.required_without'  => 'Choose at least one category.',
        ];
    }


}
