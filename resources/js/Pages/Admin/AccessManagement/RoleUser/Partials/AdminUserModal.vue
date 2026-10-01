<script setup>
/**
 * Add / edit an admin user. Replaces the standalone Create and Edit pages.
 *
 * On edit the password fields are optional — leaving them blank keeps the
 * current password, which the old page never said out loud.
 */
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  admin: { type: Object, default: null },
  roles: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const isEdit = computed(() => Boolean(props.admin?.id))

const form = useForm({
  name: props.admin?.name ?? '',
  email: props.admin?.email ?? '',
  password: '',
  password_confirmation: '',
  role: props.admin?.roles?.[0]?.name ?? '',
})

function submit() {
  const options = { preserveScroll: true, onSuccess: () => emit('close') }

  if (isEdit.value) {
    form.put(route('role-user.update', props.admin.id), options)
  } else {
    form.post(route('role-user.store'), options)
  }
}
</script>

<template>
  <FormModal
    :title="isEdit ? 'Edit admin user' : 'Add admin user'"
    :subtitle="isEdit ? admin.email : 'They will be able to sign in to the admin panel'"
    size="lg"
    :busy="form.processing"
    :dirty="form.isDirty"
    @close="emit('close')"
  >
    <form id="admin-user-form" @submit.prevent="submit">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="au-name" class="form-label">Name <span class="req">*</span></label>
          <input
            id="au-name"
            v-model="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': form.errors.name }"
            data-autofocus
          />
          <p v-if="form.errors.name" class="invalid-note">{{ form.errors.name }}</p>
        </div>

        <div class="col-md-6">
          <label for="au-email" class="form-label">Email <span class="req">*</span></label>
          <input
            id="au-email"
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': form.errors.email }"
            autocomplete="off"
          />
          <p v-if="form.errors.email" class="invalid-note">{{ form.errors.email }}</p>
        </div>

        <div class="col-md-6">
          <label for="au-password" class="form-label">
            Password <span v-if="!isEdit" class="req">*</span>
          </label>
          <input
            id="au-password"
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': form.errors.password }"
            autocomplete="new-password"
            :placeholder="isEdit ? 'Leave blank to keep current' : ''"
          />
          <p v-if="form.errors.password" class="invalid-note">{{ form.errors.password }}</p>
        </div>

        <div class="col-md-6">
          <label for="au-password2" class="form-label">Confirm password</label>
          <input
            id="au-password2"
            v-model="form.password_confirmation"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />
        </div>

        <div class="col-md-6">
          <label for="au-role" class="form-label">Role <span class="req">*</span></label>
          <select
            id="au-role"
            v-model="form.role"
            class="form-select"
            :class="{ 'is-invalid': form.errors.role }"
          >
            <option value="">Choose a role…</option>
            <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
          </select>
          <p v-if="form.errors.role" class="invalid-note">{{ form.errors.role }}</p>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" form="admin-user-form" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : 'Add user') }}
      </button>
    </template>
  </FormModal>
</template>

<style scoped>
.req { color: var(--st-danger); font-weight: 700; }
.invalid-note { margin: 4px 0 0; font-size: var(--fs-sm); color: var(--st-danger); }
</style>
