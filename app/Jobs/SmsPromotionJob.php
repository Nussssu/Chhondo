<?php

namespace App\Jobs;

use App\Models\BusinessSetting;
use App\Models\Order;
use App\Models\PromotionalSms;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SmsPromotionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $promotionId;

    /** Raw request payload (target_type, categories[], customers[], products[], flags, message). */
    public array $payload;

    public function __construct(int $promotionId, array $payload)
    {
        $this->promotionId = $promotionId;
        $this->payload     = $payload;
    }

    public function handle(): void
    {
        $promotion = PromotionalSms::find($this->promotionId);
        if (! $promotion) {
            return;
        }

        try {
            $numbers = $this->resolveRecipients($this->payload);

            if (empty($numbers)) {
                $promotion->update(['numbers' => [], 'status' => 'no_numbers']);
                return;
            }

            $promotion->update(['numbers' => $numbers]);

            $sent = $this->sendToGateway($numbers, (string) $promotion->sms);

            $promotion->update(['status' => $sent ? 'sent' : 'failed']);
        } catch (\Throwable $e) {
            Log::error('SmsPromotionJob failed: ' . $e->getMessage());
            $promotion->update(['status' => 'failed']);
        }
    }

    /**
     * Turn the targeting selection into a de-duplicated list of normalized
     * phone numbers. Numbers come from the orders table (phone_number) since
     * that is the real deliverable number and also covers guest checkouts.
     */
    private function resolveRecipients(array $p): array
    {
        $targetType = $p['target_type'] ?? 'customer';
        $raw        = collect();

        switch ($targetType) {
            case 'category':
                $categoryIds = array_filter((array) ($p['categories'] ?? []));
                if (! empty($categoryIds)) {
                    $raw = Order::query()
                        ->whereNotNull('phone_number')
                        ->whereHas('items.product', fn ($q) => $q->inCategories($categoryIds))
                        ->pluck('phone_number');
                }
                break;

            case 'product':
                if (! empty($p['all_products'])) {
                    $raw = Order::whereNotNull('phone_number')->pluck('phone_number');
                } else {
                    $productIds = array_filter((array) ($p['products'] ?? []));
                    if (! empty($productIds)) {
                        $raw = Order::query()
                            ->whereNotNull('phone_number')
                            ->whereHas('items', fn ($q) => $q->whereIn('product_id', $productIds))
                            ->pluck('phone_number');
                    }
                }
                break;

            case 'customer_type':
                $raw = $this->recipientsByCustomerType($p['customer_type'] ?? '');
                break;

            case 'customer':
            default:
                if (! empty($p['all_customers'])) {
                    $raw = Order::whereNotNull('phone_number')->pluck('phone_number');
                } else {
                    $customerIds = array_filter((array) ($p['customers'] ?? []));
                    if (! empty($customerIds)) {
                        $fromOrders = Order::whereIn('user_identifier', $customerIds)
                            ->whereNotNull('phone_number')
                            ->pluck('phone_number');
                        $fromUsers = User::whereIn('id', $customerIds)
                            ->whereNotNull('phone')
                            ->pluck('phone');
                        $raw = $fromOrders->concat($fromUsers);
                    }
                }
                break;
        }

        return $raw
            ->map(fn ($n) => $this->normalize((string) $n))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Segment customers by how many orders their phone number has placed.
     *   new     → exactly 1 order
     *   regular → 2–4 orders
     *   vip     → 5+ orders
     */
    private function recipientsByCustomerType(string $type): \Illuminate\Support\Collection
    {
        $query = Order::query()
            ->select('phone_number')
            ->whereNotNull('phone_number')
            ->groupBy('phone_number');

        switch ($type) {
            case 'new':
                $query->havingRaw('COUNT(*) = 1');
                break;
            case 'regular':
                $query->havingRaw('COUNT(*) BETWEEN 2 AND 4');
                break;
            case 'vip':
                $query->havingRaw('COUNT(*) >= 5');
                break;
            default:
                return collect();
        }

        return $query->pluck('phone_number');
    }

    /**
     * Normalize a Bangladeshi number to 8801XXXXXXXXX. Returns '' when the
     * value can't be made into a plausible number.
     */
    private function normalize(string $raw): string
    {
        $phone = preg_replace('/[+\s-]/', '', $raw);
        if ($phone === '' || ! ctype_digit($phone)) {
            return '';
        }

        if (! str_starts_with($phone, '880')) {
            $phone = '880' . ltrim($phone, '0');
        }

        // A valid BD mobile in 880 form is 13 digits (880 + 1 + 9 digits).
        return strlen($phone) === 13 ? $phone : '';
    }

    /**
     * Send the message to every recipient via BulkSMSBD. The gateway accepts a
     * comma-separated list in a single call, so we batch to stay well within
     * request limits. Returns true if the gateway was called successfully at
     * least once.
     */
    private function sendToGateway(array $numbers, string $message): bool
    {
        $sms = app(\App\Services\Sms\ReveSmsService::class);

        if (! $sms->isEnabled()) {
            Log::warning('SmsPromotionJob: the REVE SMS gateway is not configured or is switched off.');

            return false;
        }

        $anySent = false;

        // Batched so one very large campaign does not become a single
        // request the gateway refuses.
        foreach (array_chunk($numbers, 500) as $chunk) {
            $result = $sms->sendBulk($chunk, $message);

            if ($result['ok']) {
                $anySent = true;
                Log::info('SmsPromotionJob sent to ' . count($chunk) . ' recipients.');
            } else {
                Log::error('SmsPromotionJob gateway error: ' . $result['message']);
            }
        }

        return $anySent;
    }
}
