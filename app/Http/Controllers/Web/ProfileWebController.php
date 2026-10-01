<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Propaganistas\LaravelPhone\Rules\Phone as PhoneRule;

class ProfileWebController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            // Optional, but a number that is given must be a real one —
            // the same libphonenumber check the checkout form applies.
            'phone'         => ['nullable', 'string', 'max:30', (new PhoneRule)->country(['BD'])->international()->mobile()],
            'date_of_birth' => 'nullable|date',
        ], [
            'phone.phone' => 'Enter a valid phone number.',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Replace the profile photo.
     *
     * The camera badge on the avatar used to open the details form, which had
     * no way to choose a picture, so the photo could never be set at all.
     */
    public function updateAvatar(Request $request, ImageUploadService $images)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        ], [
            'image.required' => 'Choose a picture to upload.',
            'image.image'    => 'That file is not an image.',
            'image.max'      => 'The picture must be 4MB or smaller.',
        ]);

        $user = Auth::user();
        $previous = $user->getRawOriginal('image');

        $path = $images->uploadImage($request->file('image'), 'users');

        if (! $path) {
            return back()->withErrors(['image' => 'The picture could not be saved.']);
        }

        $user->update(['image' => $path]);

        // The old file is only removed once the new one is safely stored, and
        // never when it is still listed in the media library.
        if ($previous && $previous !== $path) {
            $images->deleteFileUnlessInLibrary($previous);
        }

        return back()->with('success', 'Profile photo updated.');
    }
}
