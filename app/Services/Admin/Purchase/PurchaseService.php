<?php
namespace App\Services\Admin\Purchase;

use App\Repositories\Admin\Purchase\PurchaseRepository;
use App\Repositories\Admin\Purchase\PurchaseRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PurchaseService implements PurchaseServiceInterface
{
    protected $purchaseRepository;

    public function __construct(PurchaseRepositoryInterface $purchaseRepository)
    {
        $this->purchaseRepository = $purchaseRepository;
    }

    public function createPurchase(array $data): array
    {

        return DB::transaction(function () use ($data) {
            
            // Items are typed by hand and stored on the purchase itself. They
            // are deliberately not matched to catalogue products: a purchase no
            // longer edits product stock or selling prices behind the operator.
            $purchase = $this->purchaseRepository->createPurchase($data);

            return [
                'message'     => 'Purchase created successfully.',
                'purchase_id' => $purchase->id,
            ];
        });
    }

}
