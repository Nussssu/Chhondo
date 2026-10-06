<?php

namespace App\Services\Mail;

use App\Models\SmtpSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

/**
 * Points the mailer at the server saved in Store settings › Email.
 *
 * The settings were stored but never applied, so every email went out through
 * whatever .env happened to hold. This is called immediately before each send
 * rather than in a service provider: it reads the database, and the vast
 * majority of requests send nothing.
 */
class MailConfigurator
{
    private static bool $applied = false;

    /** The saved settings, or null when the shop has not configured email. */
    public function settings(): ?SmtpSetting
    {
        return SmtpSetting::first();
    }

    /** Whether the shop has enough saved to send anything at all. */
    public function isConfigured(): bool
    {
        $settings = $this->settings();

        if (! $settings || blank($settings->email_from)) {
            return false;
        }

        // Without SMTP the app falls back to whatever mailer .env names, which
        // is a real configuration on most hosts — so only the from address is
        // strictly required.
        return ! $settings->use_smtp || filled($settings->smtp_host);
    }

    /**
     * Apply the saved settings to the mail config for this request.
     *
     * @param  bool  $force  re-apply even if this request already did, which the
     *                       settings screen needs after a save.
     */
    public function apply(bool $force = false): void
    {
        if (self::$applied && ! $force) {
            return;
        }

        $settings = $this->settings();

        if (! $settings) {
            return;
        }

        if (filled($settings->email_from)) {
            Config::set('mail.from.address', $settings->email_from);
            Config::set('mail.from.name', \App\Support\Brand::rebrand($settings->email_from_name ?: config('app.name')));
        }

        if ($settings->use_smtp && filled($settings->smtp_host)) {
            Config::set('mail.default', 'smtp');
            Config::set('mail.mailers.smtp.transport', 'smtp');
            Config::set('mail.mailers.smtp.host', $settings->smtp_host);
            Config::set('mail.mailers.smtp.port', (int) ($settings->smtp_port ?: 587));
            Config::set('mail.mailers.smtp.username', $settings->smtp_username ?: null);
            Config::set('mail.mailers.smtp.password', $settings->smtp_password ?: null);
            // "none" is a real choice on local relays; Laravel expects null for it.
            Config::set(
                'mail.mailers.smtp.encryption',
                in_array($settings->smtp_encryption, ['ssl', 'tls'], true) ? $settings->smtp_encryption : null
            );
        }

        // The mailer is resolved once per process and caches its transport, so
        // a config change after that point would be ignored without this.
        Mail::purge('smtp');
        app()->forgetInstance('mail.manager');
        app()->forgetInstance('mailer');

        self::$applied = true;
    }
}
