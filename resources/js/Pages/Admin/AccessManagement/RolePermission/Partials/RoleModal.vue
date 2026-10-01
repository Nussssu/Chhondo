<script setup>
/**
 * Create / edit a role and its permissions.
 *
 * Replaces the standalone Create and Edit pages. The permission grid is wide
 * but shallow — a name plus checkboxes — so it fits a large modal, and
 * selecting permissions no longer costs two page loads.
 */
import { computed } from 'vue'
import { useForm } from '@inertiajs/vue3'
import FormModal from '@/components/Admin/FormModal.vue'

const props = defineProps({
  role: { type: Object, default: null },
  // { groupName: [{ id, name }, …] }
  permissions: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])

const isEdit = computed(() => Boolean(props.role?.id))

const form = useForm({
  name: props.role?.name ?? '',
  permissions: (props.role?.permissions ?? []).map((p) => p.name),
})

const groups = computed(() => Object.entries(props.permissions))

const totalCount = computed(() =>
  groups.value.reduce((n, [, items]) => n + items.length, 0)
)

function groupState(items) {
  const picked = items.filter((i) => form.permissions.includes(i.name)).length
  if (picked === 0) return 'none'
  return picked === items.length ? 'all' : 'some'
}

function toggleGroup(items) {
  const names = items.map((i) => i.name)
  if (groupState(items) === 'all') {
    form.permissions = form.permissions.filter((n) => !names.includes(n))
  } else {
    form.permissions = [...new Set([...form.permissions, ...names])]
  }
}

function toggleAll() {
  const all = groups.value.flatMap(([, items]) => items.map((i) => i.name))
  form.permissions = form.permissions.length === all.length ? [] : all
}

function submit() {
  const options = { preserveScroll: true, onSuccess: () => emit('close') }

  if (isEdit.value) {
    form.put(route('role-permission.update', props.role.id), options)
  } else {
    form.post(route('role-permission.store'), options)
  }
}
</script>

<template>
  <FormModal
    :title="isEdit ? `Edit ${role.name}` : 'Create role'"
    subtitle="Choose what this role can reach in the admin panel"
    size="xl"
    :busy="form.processing"
    :dirty="form.isDirty"
    @close="emit('close')"
  >
    <form id="role-form" @submit.prevent="submit">
      <div class="mb-4">
        <label for="role-name" class="form-label">Role name <span class="req">*</span></label>
        <input
          id="role-name"
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': form.errors.name }"
          placeholder="e.g. Store manager"
          data-autofocus
        />
        <p v-if="form.errors.name" class="invalid-note">{{ form.errors.name }}</p>
      </div>

      <div class="perm-head">
        <span class="perm-count">
          <strong>{{ form.permissions.length }}</strong> of {{ totalCount }} permissions selected
        </span>
        <button type="button" class="perm-toggle-all" @click="toggleAll">
          {{ form.permissions.length === totalCount ? 'Clear all' : 'Select all' }}
        </button>
      </div>
      <p v-if="form.errors.permissions" class="invalid-note mb-2">{{ form.errors.permissions }}</p>

      <div v-for="[groupName, items] in groups" :key="groupName" class="perm-group">
        <div class="perm-group-head">
          <h3 class="perm-group-title">{{ groupName }}</h3>
          <button type="button" class="perm-group-toggle" @click="toggleGroup(items)">
            {{ groupState(items) === 'all' ? 'Clear' : 'Select all' }}
          </button>
        </div>

        <div class="perm-grid">
          <label v-for="item in items" :key="item.id" class="perm-item">
            <input v-model="form.permissions" type="checkbox" :value="item.name" />
            <span>{{ item.name }}</span>
          </label>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" :disabled="form.processing" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" form="role-form" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
        {{ form.processing ? 'Saving…' : (isEdit ? 'Save changes' : 'Create role') }}
      </button>
    </template>
  </FormModal>
</template>

<style scoped>
.req { color: var(--st-danger); font-weight: 700; }
.invalid-note { margin: 4px 0 0; font-size: var(--fs-sm); color: var(--st-danger); }

.perm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--sp-3);
}

.perm-count { font-size: var(--fs-sm); color: var(--text-muted); }
.perm-count strong { color: var(--text); }

.perm-toggle-all,
.perm-group-toggle {
  padding: 0;
  border: 0;
  background: none;
  color: var(--admin-green-600);
  font-size: var(--fs-sm);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.perm-group { margin-bottom: var(--sp-4); }

.perm-group-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-bottom: var(--sp-2);
}

.perm-group-title {
  margin: 0;
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-muted);
}

.perm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: var(--sp-1) var(--sp-3);
}

.perm-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 5px 8px;
  border-radius: var(--r-sm);
  font-size: var(--fs-sm);
  cursor: pointer;
}

.perm-item:hover { background: var(--surface-sunk); }

.perm-item input {
  width: 15px;
  height: 15px;
  accent-color: var(--admin-green-600);
  flex-shrink: 0;
}
</style>
