<?php

namespace App\Services\Sms;

use App\Models\BusinessSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * REVE SMS (smpp.revesms.com).
 *
 * Every SMS the site sends goes through here — order confirmations, promotions,
 * the test button in the admin — so the gateway is configured and debugged in
 * one place rather than re-implemented at each call site.
 *
 * The API is a plain GET returning JSON:
 *   /sendtext?apikey=&secretkey=&callerID=&toUser=&messageContent=
 *   {"Status":"0","Text":"ACCEPTD","Message_ID":"444"}
 */
class ReveSmsService
{
    public const SETTING_KEY = 'revesms';
    public const SETTING_TYPE = 'sms_config';

    public const DEFAULT_BASE_URL = 'https://smpp.revesms.com:7790';

    /** What each Status in a gateway reply means, from the API docs. */
    private const STATUS_MESSAGES = [
        '0'    => 'Accepted by the gateway',
        '1'    => 'Request failed',
        '2'    => 'Pending',
        '4'    => 'Sent',
        '101'  => 'Gateway internal server error',
        '108'  => 'Wrong secret key, or none provided',
        '109'  => 'API key missing, or the account is deleted',
        '114'  => 'Message content missing, or the message id is not valid',
        '-42'  => 'Authorisation failed',
    ];

    /** The saved configuration, or an empty array when nothing is set up yet. */
    public function config(): array
    {
        $row = BusinessSetting::where('settings_type', self::SETTING_TYPE)
            ->where('key_name', self::SETTING_KEY)
            ->first();

        if (! $row) {
            return [];
        }

        // `values` is cast to array on the model, but older rows were written
        // as a JSON string, so both shapes are accepted.
        $values = is_array($row->values) ? $row->values : (array) json_decode((string) $row->values, true);

        return $values + ['is_active' => (int) $row->is_active === 1];
    }

    public function isConfigured(): bool
    {
        $c = $this->config();

        return filled($c['api_key'] ?? null)
            && filled($c['secret_key'] ?? null)
            && filled($c['sender_id'] ?? null);
    }

    public function isEnabled(): bool
    {
        return $this->isConfigured() && ($this->config()['is_active'] ?? false);
    }

    /**
     * Send one message.
     *
     * Never throws: a gateway outage must not take an order down with it. The
     * result says what happened so the caller can log or surface it.
     *
     * @return array{ok: bool, status: ?string, message: string, message_id: ?string}
     */
    public function send(string $phone, string $message): array
    {
        if (! $this->isConfigured()) {
            return $this->result(false, null, 'SMS is not configured.');
        }

        $to = $this->normalisePhone($phone);

        if ($to === '') {
            return $this->result(false, null, 'No usable phone number.');
        }

        if (trim($message) === '') {
            return $this->result(false, null, 'The message is empty.');
        }

        $c = $this->config();

        try {
            $response = Http::timeout(15)->get($this->baseUrl() . '/sendtext', [
                'apikey'         => $c['api_key'],
                'secretkey'      => $c['secret_key'],
                'callerID'       => $c['sender_id'],
                'toUser'         => $to,
                'messageContent' => $message,
            ]);
        } catch (Throwable $e) {
            Log::error('REVE SMS request failed: ' . $e->getMessage());

            return $this->result(false, null, 'Could not reach the SMS gateway.');
        }

        return $this->interpret($response->body());
    }

    /**
     * Send one message to many numbers in a single call.
     *
     * REVE takes a JSON payload of recipient groups; numbers are comma
     * separated within a group.
     *
     * @param  list<string>  $phones
     */
    public function sendBulk(array $phones, string $message): array
    {
        if (! $this->isConfigured()) {
            return $this->result(false, null, 'SMS is not configured.');
        }

        $to = array_values(array_filter(array_map(
            fn ($p) => $this->normalisePhone((string) $p),
            $phones
        )));

        if ($to === []) {
            return $this->result(false, null, 'No usable phone numbers.');
        }

        $c = $this->config();

        try {
            $response = Http::timeout(30)->get($this->baseUrl() . '/send', [
                'apikey'    => $c['api_key'],
                'secretkey' => $c['secret_key'],
                'content'   => json_encode([[
                    'callerID'       => $c['sender_id'],
                    'toUser'         => implode(',', $to),
                    'messageContent' => $message,
                ]], JSON_UNESCAPED_UNICODE),
            ]);
        } catch (Throwable $e) {
            Log::error('REVE SMS bulk request failed: ' . $e->getMessage());

            return $this->result(false, null, 'Could not reach the SMS gateway.');
        }

        return $this->interpret($response->body());
    }

    /** Delivery state of a previously sent message. */
    public function status(string $messageId): array
    {
        if (! $this->isConfigured()) {
            return $this->result(false, null, 'SMS is not configured.');
        }

        $c = $this->config();

        try {
            $response = Http::timeout(15)->get($this->baseUrl() . '/getstatus', [
                'apikey'    => $c['api_key'],
                'secretkey' => $c['secret_key'],
                'messageid' => $messageId,
            ]);
        } catch (Throwable $e) {
            Log::error('REVE SMS status request failed: ' . $e->getMessage());

            return $this->result(false, null, 'Could not reach the SMS gateway.');
        }

        return $this->interpret($response->body());
    }

    /**
     * Remaining balance. This endpoint lives on the portal host rather than the
     * API port, and answers with a bare number rather than JSON.
     */
    public function balance(): array
    {
        $c = $this->config();
        $client = $c['client_id'] ?? null;

        if (blank($client)) {
            return $this->result(false, null, 'Add your client ID to check the balance.');
        }

        try {
            $response = Http::timeout(15)
                ->get('https://smpp.revesms.com/sms/smsConfiguration/smsClientBalance.jsp', [
                    'client' => $client,
                ]);
        } catch (Throwable $e) {
            Log::error('REVE SMS balance request failed: ' . $e->getMessage());

            return $this->result(false, null, 'Could not reach the SMS gateway.');
        }

        $body = trim(strip_tags($response->body()));

        return $body === ''
            ? $this->result(false, null, 'The gateway returned no balance.')
            : $this->result(true, null, $body);
    }

    /** Turn a gateway reply into a plain result. */
    private function interpret(string $body): array
    {
        $decoded = json_decode(trim($body), true);

        if (! is_array($decoded) || ! array_key_exists('Status', $decoded)) {
            Log::warning('REVE SMS returned an unreadable reply: ' . $body);

            return $this->result(false, null, 'The gateway sent an unexpected reply.');
        }

        $status = (string) $decoded['Status'];
        $text   = (string) ($decoded['Text'] ?? '');

        // 0 is the only status that means the gateway took the message.
        $ok = $status === '0';

        $message = self::STATUS_MESSAGES[$status] ?? "Gateway status {$status}";

        if ($text !== '') {
            $message .= " ({$text})";
        }

        return $this->result($ok, $status, $message, $decoded['Message_ID'] ?? null);
    }

    private function result(bool $ok, ?string $status, string $message, ?string $messageId = null): array
    {
        return ['ok' => $ok, 'status' => $status, 'message' => $message, 'message_id' => $messageId];
    }

    private function baseUrl(): string
    {
        $url = $this->config()['base_url'] ?? '';

        return rtrim(filled($url) ? $url : self::DEFAULT_BASE_URL, '/');
    }

    /**
     * REVE addresses Bangladeshi numbers as 880XXXXXXXXXX.
     *
     * Numbers reach us as E.164 (+8801…) from the storefront and as local
     * (01…) from older rows and the POS, so both are folded to that form.
     */
    public function normalisePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone) ?? '';

        if ($digits === '') {
            return '';
        }

        if (str_starts_with($digits, '880')) {
            return $digits;
        }

        // 01XXXXXXXXX -> 8801XXXXXXXXX
        if (str_starts_with($digits, '0')) {
            return '880' . ltrim($digits, '0');
        }

        // 1XXXXXXXXX, as typed without the leading zero.
        if (str_starts_with($digits, '1') && strlen($digits) === 10) {
            return '880' . $digits;
        }

        return $digits;
    }
}
