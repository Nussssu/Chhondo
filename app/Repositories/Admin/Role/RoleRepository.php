<?php

namespace App\Repositories\Admin\Role;

use Spatie\Permission\Models\Role;

class RoleRepository
{
    /**
     * Every role with the permissions it grants.
     *
     * This used to return a paginator, which the roles screen — a client-side
     * table expecting a plain list — could not read: the page showed "No roles
     * yet" however many roles existed. Permissions were not loaded either, so
     * every row read "No permissions assigned" and opening a role for editing
     * started from an empty selection, wiping its permissions on save.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllRoles()
    {
        return Role::with('permissions:id,name')->orderBy('name')->get();
    }
}
