<?php

namespace App\Services\Admin\SidebarSlider;


interface SidebarSliderServiceInterface
{
    public function store($request);
    public function update($request, $id);
    public function delete($id);
    public function reorder(array $ids): void;
    public function get();
    public function getById($id);
}