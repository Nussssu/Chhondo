<?php

namespace App\Repositories\Admin\Product;

use App\Models\Product;
use Illuminate\Http\Request;

interface ProductRepositoryInterface
{
    public function index();
    public function getProductCreationData();
    ////////////////////
    public function createProduct(array $validatedData);
    // public function createProductAttributes($productId, array $attributes, array $singleOptions,$combinationsIds);
    public function createProductCombinations(int $productId, array $combinations): void;
    public function handleProductAttributes(int $productId, array $data): void;


    // public function  handleProductAttributesUpdate($productId, array $data);

    ////////////////////


    public function filterProducts(array $filters);
    public function getCategories();

    public function bulkDelete(array $productIds);

    public function bulkPublish(array $productIds);

    public function bulkUnpublish(array $productIds);
}