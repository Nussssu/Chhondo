<?php

namespace App\Http\Controllers\Admin\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuppliersController extends Controller
{
    public function index()
    {
        // Newest first: after adding a supplier the operator expects to see it
        // straight away, not to hunt for it alphabetically. Ordered by id rather
        // than created_at so several added in the same second still sort right.
        $suppliers = Supplier::latest('id')->get();
        return Inertia::render('Admin/Suppliers/Index', ['suppliers' => $suppliers]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_name' => 'required|string|max:255',               // Required, max 255 characters
            'company_name' => 'required|string|max:255',                // Required, max 255 characters
            'company_phone' => 'required|string|regex:/^01[3-9]\d{8}$/', // Required, specific format for BD phone numbers
            'company_address' => 'nullable|string|max:500',             // Required, max 500 characters for longer addresses
        ]);

        // Store the supplier data
        Supplier::create($data);
        return redirect()->route('admin.suppliers.index')->with('success', 'New supplier inserted');
    }

    public function update(Request $request, $id){

        $supplier = Supplier::findOrFail($id);

        $data = $request->validate([
            'supplier_name' => 'required|string|max:255',               // Required, max 255 characters
            'company_name' => 'required|string|max:255',                // Required, max 255 characters
            'company_phone' => 'required|string|regex:/^01[3-9]\d{8}$/', // Required, specific format for BD phone numbers
            'company_address' => 'nullable|string|max:500',             // Required, max 500 characters for longer addresses
        ]);

       

        $supplier->update($data);


        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier Info updated');


    }

    public function destroy($id)
    {

       
        Supplier::findorFail($id)->delete();

        return redirect()->back()->with('success', 'Data deleted successfully');
    }



}
