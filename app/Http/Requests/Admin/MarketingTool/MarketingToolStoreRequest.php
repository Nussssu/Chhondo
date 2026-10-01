<?php

namespace App\Http\Requests\Admin\MarketingTool;

use App\Models\MarketingTool;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarketingToolStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * `name` is kept for the older tool rows (Facebook Pixel, GTM, …) and is
     * filled from the title when the form does not send one.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->input('name') ?: $this->input('title'),
        ]);
    }

    public function rules()
    {
        return [
            'title'         => 'required|string|max:191',
            'name'          => 'required|string|max:191',
            'identifier'    => 'nullable|string|max:191',
            'location'      => ['required', Rule::in(MarketingTool::LOCATIONS)],
            'target'        => ['required', Rule::in(array_keys(MarketingTool::TARGETS))],
            'target_urls'   => 'nullable|string|required_if:target,custom',
            'script'        => 'required|string',
            'second_script' => 'nullable|string',
            'is_active'     => 'boolean',
            'priority'      => 'nullable|integer|min:0|max:999',
        ];
    }

    public function messages()
    {
        return [
            'title.required'       => 'Give the snippet a title so you can find it later.',
            'script.required'      => 'There is no code to save.',
            'target_urls.required_if' => 'Add at least one URL pattern for a custom target.',
        ];
    }
}
