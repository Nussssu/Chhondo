<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Propaganistas\LaravelPhone\Rules\Phone as PhoneRule;

class AuthWebController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|min:3|max:255',
            'email'    => 'required|email|unique:users,email',
            // The same rule checkout, the contact form and the profile use, so a
            // number accepted at one entry point is accepted at all of them.
            'phone'    => ['required', 'string', 'max:20', (new PhoneRule)->country(['BD'])->international()->mobile()],
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignCustomerRole();

        // The account is created but not signed in: the visitor is sent to the
        // login page and told to use their new credentials, so the first thing
        // they do with the password is prove it works.
        return redirect()->route('login')
            ->with('status', 'Registration successful. Please log in to continue.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
