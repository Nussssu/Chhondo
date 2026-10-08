<?php

namespace App\Services\Admin\Order;

use App\Models\Order;
use Illuminate\Support\Collection;

/** Read-only, rule-based assessment of this shop's order records, not a fraud guarantee. */
class OrderRiskAssessment
{
    public static function normalizePhone(?string $value): string
    {
        $value = strtr($value ?? '', array_combine(preg_split('//u', '০১২৩৪৫৬৭৮৯', -1, PREG_SPLIT_NO_EMPTY), range(0, 9)));
        $digits = preg_replace('/[^0-9]/', '', $value);
        return preg_replace('/^(?:00880|880)(?=1\d{9}$)/', '0', $digits);
    }

    public function forOrder(Order $order): array
    {
        $phone = self::normalizePhone($order->phone_number);
        $history = collect();
        if ($phone !== '') {
            // Match old local numbers and newer E.164 numbers without modifying any rows.
            $expression = 'phone_number';
            foreach (array_combine(preg_split('//u', '০১২৩৪৫৬৭৮৯', -1, PREG_SPLIT_NO_EMPTY), range(0, 9)) as $from => $to) {
                $expression = "REPLACE($expression, '$from', '$to')";
            }
            foreach ([' ', '+', '-', '(', ')', '.'] as $separator) {
                $expression = "REPLACE($expression, '$separator', '')";
            }
            $variants = preg_match('/^01[3-9]\d{8}$/', $phone)
                ? [$phone, '88'.$phone, '0088'.$phone] : [$phone];
            $history = Order::whereRaw($expression.' IN ('.implode(',', array_fill(0, count($variants), '?')).')', $variants)
                ->where('order_status', '!=', 'incomplete')
                ->get(['id', 'order_status', 'order_type']);
        }
        $order->loadMissing('user');
        return $this->summarize($order, $history);
    }

    public function summarize(Order $order, Collection $history): array
    {
        $phone = self::normalizePhone($order->phone_number);
        $validPhone = (bool) preg_match('/^01[3-9]\d{8}$/', $phone);
        $hasAddress = trim((string) $order->address) !== '';
        $blocked = (bool) $order->user?->is_block;
        $cancellations = $history->filter(fn ($row) => in_array(strtolower($row->order_status), ['cancelled', 'canceled'], true))->count();
        $previous = $history->filter(fn ($row) => $row->id !== $order->id && $row->order_type !== Order::TYPE_POS);
        $delivered = $previous->filter(fn ($row) => in_array(strtolower($row->order_status), ['delivered', 'completed'], true))->count();
        $failed = $previous->filter(fn ($row) => in_array(strtolower($row->order_status), ['cancelled', 'canceled', 'returned'], true))->count();
        $resolved = $delivered + $failed;
        $rate = $resolved ? round($delivered / $resolved * 100, 1) : null;
        $risk = ! $validPhone || $blocked || ($resolved >= 3 && $rate < 50) ? 'high'
            : ($hasAddress && $resolved >= 3 && $rate >= 80 ? 'low' : 'medium');
        $ip = $order->user?->ip_address;

        return [
            'invoice' => $order->invoice_number,
            'phone' => $order->phone_number,
            'ip_address' => filter_var($ip, FILTER_VALIDATE_IP) ? $ip : null,
            'total_orders' => $history->count(),
            'cancellations' => $cancellations,
            'risk' => $risk,
            'title' => match ($risk) { 'low' => 'Local Checks Passed / Low Risk', 'high' => 'Review Required / High Risk', default => 'Manual Review / Limited Evidence' },
            'description' => match ($risk) { 'low' => 'Available local checks passed; this is not a fraud guarantee.', 'high' => 'One or more local checks need attention before dispatch.', default => 'Not enough verified delivery history, or delivery details need review.' },
            'source' => 'This shop’s order history',
            'checks' => [
                ['status' => $validPhone ? 'pass' : 'fail', 'label' => $validPhone ? 'Valid Bangladesh mobile phone format' : 'Missing or invalid Bangladesh mobile phone format'],
                ['status' => $hasAddress ? 'pass' : 'unknown', 'label' => $hasAddress ? 'Delivery address provided (service zone not verified)' : 'No delivery address saved'],
                ['status' => $resolved >= 3 ? ($rate >= 80 ? 'pass' : 'fail') : 'unknown', 'label' => $resolved ? "Previous delivery completion: {$rate}% ({$resolved} resolved orders)" : 'Previous delivery completion: No resolved order history'],
                ...($blocked ? [['status' => 'fail', 'label' => 'Customer account is blocked']] : []),
            ],
            'courier_verified' => false,
            'courier_note' => 'Local assessment only. External courier history is unavailable; the courier service requires a registered website URL, not localhost.',
        ];
    }
}
