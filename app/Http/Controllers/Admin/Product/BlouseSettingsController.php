<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\LayoutSetting;
use App\Services\BlouseCustomization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlouseSettingsController extends Controller
{
    public function edit(BlouseCustomization $blouse)
    {
        return Inertia::render('Admin/Products/BlouseSettings', ['settings' => $blouse->settings()]);
    }

    public function update(Request $request, BlouseCustomization $blouse)
    {
        $rules = ['settings.enabled' => 'required|boolean'];
        foreach (['label', 'legacy_without_label', 'legacy_with_label', 'sleeve_label', 'size_label', 'requirements_label', 'requirements_placeholder', 'submit_label'] as $label) {
            $rules["settings.$label"] = 'required|string|max:150';
        }
        $rules['settings.note'] = 'nullable|string|max:1000';
        foreach (['options', 'sleeves', 'sizes'] as $group) {
            $rules["settings.$group"] = 'present|array|max:50';
            $rules["settings.$group.*.id"] = 'required|string|regex:/^[a-zA-Z0-9_-]+$/|max:80|distinct';
            $rules["settings.$group.*.label"] = 'required|string|max:150';
            $rules["settings.$group.*.enabled"] = 'required|boolean';
        }
        $rules['settings.options.*.price'] = 'required|numeric|min:0|max:100000';
        $data = $request->validate($rules)['settings'];
        if ($data['enabled']) {
            foreach (['options', 'sleeves', 'sizes'] as $group) {
                if (! collect($data[$group])->contains(fn ($row) => (bool) $row['enabled'])) {
                    throw \Illuminate\Validation\ValidationException::withMessages(["settings.$group" => "Enable at least one {$group} entry, or turn blouse customization off."]);
                }
            }
        }
        $data['enabled'] = (bool) $data['enabled'];
        $data['note'] = $data['note'] ?? '';
        foreach (['options', 'sleeves', 'sizes'] as $group) {
            $data[$group] = array_values(array_map(function ($row) use ($group) {
                $clean = ['id' => (string) $row['id'], 'label' => trim($row['label']), 'enabled' => (bool) $row['enabled']];
                if ($group === 'options') $clean['price'] = round((float) $row['price'], 2);
                return $clean;
            }, $data[$group]));
        }
        // Merged over what is saved, so settings kept elsewhere (Store settings ›
        // Product details: the button toggles) survive a save here.
        LayoutSetting::put(BlouseCustomization::SETTINGS_KEY, array_replace($blouse->settings(), $data));
        return redirect()->back()->with('success', 'Blouse customization settings saved.');
    }
}
