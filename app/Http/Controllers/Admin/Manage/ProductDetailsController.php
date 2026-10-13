<?php

namespace App\Http\Controllers\Admin\Manage;

use App\Http\Controllers\Controller;
use App\Models\LayoutSetting;
use App\Services\BlouseCustomization;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Store settings › Product details.
 *
 * The three blouse buttons on every product page — without blouse, with
 * blouse and custom blouse — each with its own wording and on/off, and the
 * note under the custom blouse requirements box. All of it is the blouse
 * customization's own settings, so it reads the same here, in Products ›
 * Blouse options and on the storefront.
 */
class ProductDetailsController extends Controller
{
    public function edit(BlouseCustomization $blouse)
    {
        $settings = $blouse->settings();
        $custom = $settings['options'][0] ?? [];

        return Inertia::render('Admin/Manage/ProductDetails', [
            'buttons' => [
                'without_label'   => $settings['legacy_without_label'],
                'without_enabled' => (bool) ($settings['legacy_without_enabled'] ?? true),
                'with_label'      => $settings['legacy_with_label'],
                'with_enabled'    => (bool) ($settings['legacy_with_enabled'] ?? true),
                'custom_label'    => $custom['label'] ?? '',
                'custom_enabled'  => ! empty($settings['enabled']) && ($custom['enabled'] ?? true),
            ],
            'note' => $settings['note'] ?? '',
        ]);
    }

    public function update(Request $request, BlouseCustomization $blouse)
    {
        $data = $request->validate([
            'buttons.without_label'   => 'required|string|max:60',
            'buttons.without_enabled' => 'required|boolean',
            'buttons.with_label'      => 'required|string|max:60',
            'buttons.with_enabled'    => 'required|boolean',
            'buttons.custom_label'    => 'required|string|max:60',
            'buttons.custom_enabled'  => 'required|boolean',
            'note'                    => 'nullable|string|max:1000',
        ]);
        $b = $data['buttons'];

        $settings = $blouse->settings();
        $settings['legacy_without_label'] = trim($b['without_label']);
        $settings['legacy_without_enabled'] = (bool) $b['without_enabled'];
        $settings['legacy_with_label'] = trim($b['with_label']);
        $settings['legacy_with_enabled'] = (bool) $b['with_enabled'];
        if (isset($settings['options'][0])) {
            $settings['options'][0]['label'] = trim($b['custom_label']);
            $settings['options'][0]['enabled'] = (bool) $b['custom_enabled'];
        }
        // Turning the custom button on here must actually show it.
        if ($b['custom_enabled']) {
            $settings['enabled'] = true;
        }
        $settings['note'] = trim((string) ($data['note'] ?? ''));
        LayoutSetting::put(BlouseCustomization::SETTINGS_KEY, $settings);

        return redirect()->back()->with('success', 'Product details saved.');
    }
}
