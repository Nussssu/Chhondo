<?php

namespace App\Services\Mail;

use App\Mail\TemplatedMail;
use App\Models\EmailTemplate;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * The password reset link, sent in the shop's own branding.
 *
 * Unlike the order emails this is not best-effort: someone locked out of their
 * account is waiting for it, and a silent failure reads to them as "the reset
 * link never arrives". So when the branded email cannot be produced or sent,
 * the framework's plain notification is sent instead rather than nothing.
 */
class PasswordResetMailNotifier
{
    public function __construct(
        private MailConfigurator $config,
        private EmailBrand $brand,
        private EmailTemplateRenderer $renderer,
    ) {
    }

    public function send(User $user, string $token): void
    {
        if (! $this->config->isConfigured()) {
            Log::debug('Password reset email not branded: no mail server is configured.');
            $this->fallback($user, $token);

            return;
        }

        try {
            $template = $this->renderer->render(EmailTemplate::PASSWORD_RESET_CUSTOMER, [
                '{name}'    => $user->name ?: 'there',
                '{expires}' => (string) config('auth.passwords.users.expire', 60),
            ]);

            if ($template === []) {
                $this->fallback($user, $token);

                return;
            }

            $this->config->apply();

            Mail::to($user->email)->send(new TemplatedMail(
                $template,
                $this->brand->toArray(),
                ['resetUrl' => $this->resetUrl($user, $token)],
            ));
        } catch (Throwable $e) {
            Log::error('Branded password reset email failed: ' . $e->getMessage());
            $this->fallback($user, $token);
        }
    }

    /**
     * The address the reset form lives at. Built the same way Laravel's own
     * notification builds it, so an existing link keeps working.
     */
    private function resetUrl(User $user, string $token): string
    {
        return route('password.reset', [
            'token' => $token,
            'email' => $user->getEmailForPasswordReset(),
        ]);
    }

    /** Laravel's unbranded reset mail — a plain link beats no link at all. */
    private function fallback(User $user, string $token): void
    {
        try {
            $user->notifyNow(new ResetPassword($token));
        } catch (Throwable $e) {
            Log::error('Fallback password reset email failed: ' . $e->getMessage());
        }
    }
}
