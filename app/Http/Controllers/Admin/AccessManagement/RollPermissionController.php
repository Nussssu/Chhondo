<?php

namespace App\Http\Controllers\Admin\AccessManagement;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\Admin\Role\RolePermissionService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RollPermissionController extends Controller
{

    protected $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }


    public function index()
    {
        $roles = $this->rolePermissionService->getAllRoles();

        return Inertia::render('Admin/AccessManagement/RolePermission/Index', [
            'roles' => $roles,
            // Needed by the create/edit modal that replaced the standalone pages.
            'permissions' => $this->rolePermissionService->getPermissionsGroupedByGroup(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => ['required', 'max:50', 'unique:roles,name'],
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['string'],
        ]);

        $this->rolePermissionService->createRoleWithPermissions(
            $validated,
            $validated['permissions'] ?? []
        );


        return to_route('role-permission.index')->with('success', 'New role permission created successfully');
    }

    /**
     * Display the specified resource.
     */

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'          => ['required', 'max:50', 'unique:roles,name,' . $id],
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['string'],
        ]);

        $this->rolePermissionService->updateRoleWithPermissions(
            $id,
            $validated,
            $validated['permissions'] ?? []
        );

        return to_route('role-permission.index')->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->rolePermissionService->deleteRole($id);

            return redirect()->back()->with('success', 'Role has been deleted successfully');

        }catch(\Exception $e) {
            logger($e);
            return response(['message' => 'Something Went Wrong Please Try Again!'], 500);
        }
    }

}
