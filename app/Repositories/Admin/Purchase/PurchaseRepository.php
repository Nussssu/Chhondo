<?php

namespace App\Repositories\Admin\Purchase;

use App\Models\Purchase;
use Illuminate\Support\Facades\Log;

class PurchaseRepository implements PurchaseRepositoryInterface
{
    // public function createPurchase(array $data): Purchase
    // {
    //     Log::info('Creating purchase with data: ', $data);
    //     $purchaseData = collect($data)->except('products')->toArray();


    //     $purchase = Purchase::create($purchaseData);

    //     return $purchase;
    // }
    public function createPurchase(array $data): Purchase
    {
        // Log::info('Creating purchase with data: ', $data);
        return Purchase::create([
            'purchase_name' => $data['purchase_name'],
            'purchase_date' => $data['purchase_date'],
            'invoice_number' => $data['invoice_number'],
            'document' => $data['document'] ?? null,
            'comment' => $data['comment'] ?? null,
            'supplier_id' => $data['supplier_id'],
            'purchasing_price' => $data['total_purchasing_price'],
            'purchasing_paid' => $data['total_purchasing_paid'] ?? 0,
            'purchasing_due' => $data['total_purchasing_due'],
            'product_ids' => $data['product_ids'],
            'products_data' => $data['products_data'],

        ]);
    }
}
