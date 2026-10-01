<?php

namespace App\Http\Requests\Admin\Smtp;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SmtpSettingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * The server fields are required only when SMTP is switched on: a shop that
     * relies on the host's own mail transport still needs a from address, and
     * used to be blocked by rules written as if SMTP were the only option.
     */
    public function rules()
    {
        $usingSmtp = $this->boolean('use_smtp');

        return [
            'email_from'      => 'required|email',
            'email_from_name' => 'required|string|max:255',
            'contact_email'   => 'required|email',
            'admin_email'     => 'nullable|email',
            'use_smtp'        => 'boolean',
            'smtp_host'       => [$usingSmtp ? 'required' : 'nullable', 'string', 'max:255'],
            // Kept as a string column, but only a real port is accepted.
            'smtp_port'       => [$usingSmtp ? 'required' : 'nullable', 'integer', 'between:1,65535'],
            'smtp_encryption' => ['nullable', Rule::in(['ssl', 'tls', 'none'])],
            'smtp_username'   => 'nullable|string|max:255',
            // Blank means "keep the saved one", so it is never required.
            'smtp_password'   => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'email_from.required'      => 'The address emails are sent from is required.',
            'email_from.email'         => 'The from address must be a valid email address.',
            'email_from_name.required' => 'The name emails are sent from is required.',
            'contact_email.required'   => 'A contact email is required.',
            'contact_email.email'      => 'The contact email must be a valid email address.',
            'admin_email.email'        => 'The order notification address must be a valid email address.',
            'smtp_host.required'       => 'Enter the SMTP host, for example smtp.gmail.com.',
            'smtp_port.required'       => 'Enter the SMTP port — usually 465 for SSL or 587 for TLS.',
            'smtp_port.integer'        => 'The SMTP port must be a number.',
            'smtp_port.between'        => 'The SMTP port must be between 1 and 65535.',
            'smtp_encryption.in'       => 'Encryption must be SSL, TLS or none.',
        ];
    }
}
