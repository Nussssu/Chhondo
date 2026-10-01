<?php

namespace App\Services\Admin\Product;

use App\Models\AttributeOption;
use App\Repositories\Admin\Product\ProductRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index()
    {
        return $this->productRepository->index();
    }

    public function getProductCreationData()
    {
        return $this->productRepository->getProductCreationData();
    }

public function storeProduct(Request $request)
{
    try {
        DB::beginTransaction();

        $data = $request->all();
        // dd($data); 
        $product = $this->productRepository->createProduct($data);

        // Handle attributes (new structure: single/ combo)
        if (!empty($data['single']) || !empty($data['combo'])) {
            $this->productRepository->handleProductAttributes($product->id, $data);
        }

        DB::commit();
        return $product;

    } catch (\Throwable $e) {
        DB::rollBack();
        throw $e; // or return $e->getMessage();
    }
}



    // public function  handleProductAttributesUpdate($productId, array $data)
    // {


    //     return $this->productRepository->handleProductAttributesUpdate($productId, $data);
    // }



    public function filterProducts(array $filters)
    {
        return $this->productRepository->filterProducts($filters);
    }

    public function getCategories()
    {
        return $this->productRepository->getCategories();
    }

    public function bulkDelete(array $productIds)
    {
        return $this->productRepository->bulkDelete($productIds);
    }

    public function bulkPublish(array $productIds)
    {
        return $this->productRepository->bulkPublish($productIds);
    }

    public function bulkUnpublish(array $productIds)
    {
        return $this->productRepository->bulkUnpublish($productIds);
    }
}
