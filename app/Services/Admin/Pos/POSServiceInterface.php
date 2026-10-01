<?php

namespace App\Services\Admin\Pos;

interface POSServiceInterface
{
    public function getAllProducts(array $data);
    public function getAllCategories();
    public function apigetAllProducts();
}

