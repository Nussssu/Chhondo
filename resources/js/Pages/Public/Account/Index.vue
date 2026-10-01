<template>
  <Head>
    <title>My Account</title>
  </Head>

  <AccountLayout>
    <div class="profile-page">
      <div class="stat-row">
        <StatCard :value="stats.totalOrders ?? 0" label="Total Orders" />
        <StatCard :value="stats.wishlistItems ?? 0" label="Wishlist Items" />
        <StatCard :value="stats.savedAddresses ?? 0" label="Saved Addresses" />
      </div>

      <div class="profile-summary-card">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar">
            <img v-if="avatar" :src="avatar" :alt="authStore.user?.name" class="profile-avatar-img" />
            <template v-else>{{ initial }}</template>
            <span v-if="uploadingAvatar" class="profile-avatar-busy">…</span>
          </div>

          <!-- The badge opens the file picker; it used to open the details
               form, which had no way to choose a picture. -->
          <button
            type="button"
            class="profile-avatar-badge"
            aria-label="Change profile photo"
            :disabled="uploadingAvatar"
            @click="avatarInput?.click()"
          >
            <img :src="'/assets/images/account/avatar-camera-badge.svg'" alt="" />
          </button>

          <input
            ref="avatarInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="sr-only-file"
            @change="uploadAvatar"
          />
        </div>

        <div class="profile-summary-info">
          <p class="profile-name">{{ authStore.user?.name }}</p>
          <p class="profile-email">{{ authStore.user?.email }}</p>
        </div>

        <button type="button" class="profile-edit-btn" @click="openEdit">
          <img :src="'/assets/images/account/edit-pencil.svg'" alt="" />
          Edit Profile
        </button>
      </div>

      <div class="profile-info-grid">
        <div class="profile-field">
          <p class="profile-field-label">Full Name</p>
          <div class="profile-field-value">{{ authStore.user?.name || '—' }}</div>
        </div>
        <div class="profile-field">
          <p class="profile-field-label">Email Address</p>
          <div class="profile-field-value">{{ authStore.user?.email || '—' }}</div>
        </div>
        <div class="profile-field">
          <p class="profile-field-label">Phone Number</p>
          <div class="profile-field-value">{{ authStore.user?.phone || '—' }}</div>
        </div>
        <div class="profile-field">
          <p class="profile-field-label">Date of Birth</p>
          <div class="profile-field-value">{{ authStore.user?.date_of_birth || '—' }}</div>
        </div>
      </div>

      <div class="address-card">
        <p class="address-card-title">
          <img :src="'/assets/images/account/address-pin.svg'" alt="" />
          Delivery Address
        </p>

        <p v-if="!addresses.length && !drafts.length" class="address-empty">
          No saved address yet — add one below and it will fill in your checkout.
        </p>

        <!-- Saved addresses -->
        <div v-for="addr in addresses" :key="addr.id" class="addr-item" :class="{ 'is-primary': isPrimary(addr) }">
          <template v-if="editingId === addr.id">
            <AddressFields v-model="editForm" :errors="errors" />
            <div class="addr-actions">
              <button type="button" class="addr-btn addr-btn--save" :disabled="busy" @click="saveEdit(addr)">
                {{ busy ? 'Saving…' : 'Save' }}
              </button>
              <button type="button" class="addr-btn" @click="cancelEdit">Cancel</button>
            </div>
          </template>

          <template v-else>
            <div class="addr-head">
              <span class="addr-type">{{ TYPES[addr.type] || 'Home' }}</span>
              <span v-if="isPrimary(addr) && addresses.length > 1" class="addr-primary-tag">Primary</span>
              <div class="addr-head-actions">
                <button type="button" class="addr-link" @click="startEdit(addr)">Edit</button>
                <button type="button" class="addr-link addr-link--danger" @click="remove(addr)">Remove</button>
              </div>
            </div>

            <p class="addr-line addr-line--strong">{{ addr.address }}</p>
            <p class="addr-line addr-line--muted">{{ CITIES[addr.city] || '—' }}</p>

            <!-- Whichever is primary is the one checkout fills in. With only
                 one address there is nothing to choose, so the option is not
                 offered — it is primary by definition. -->
            <label v-if="addresses.length > 1" class="addr-primary">
              <input
                type="radio"
                name="primary-address"
                :checked="isPrimary(addr)"
                :disabled="busy"
                @change="makePrimary(addr)"
              />
              <span>Use as primary — filled in at checkout</span>
            </label>
          </template>
        </div>

        <!-- New addresses being written -->
        <div v-for="(draft, i) in drafts" :key="`draft-${i}`" class="addr-item is-draft">
          <AddressFields v-model="drafts[i]" :errors="i === 0 ? errors : {}" />
          <label v-if="addresses.length" class="addr-primary">
            <input v-model="draft.is_default" type="checkbox" />
            <span>Make this my primary address</span>
          </label>
          <p v-else class="addr-note">This will be your primary address.</p>
          <div class="addr-actions">
            <button type="button" class="addr-btn addr-btn--save" :disabled="busy" @click="saveDraft(i)">
              {{ busy ? 'Saving…' : 'Save address' }}
            </button>
            <button type="button" class="addr-btn" @click="drafts.splice(i, 1)">Cancel</button>
          </div>
        </div>

        <button type="button" class="addr-add" @click="addDraft">
          <Plus :size="15" />
          {{ addresses.length ? 'Add another address' : 'Add an address' }}
        </button>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <h2 class="modal-title">Edit Profile</h2>

        <form @submit.prevent="submitProfile">
          <div class="modal-field">
            <label class="modal-label">Full Name</label>
            <input v-model="form.name" type="text" class="modal-input" placeholder="Your name" />
          </div>

          <div class="modal-field">
            <label class="modal-label">Email Address</label>
            <input v-model="form.email" type="email" class="modal-input" placeholder="you@example.com" />
          </div>

          <div class="modal-field">
            <label class="modal-label">Phone Number</label>
            <PhoneField
              v-model="form.phone"
              v-model:valid="phoneValid"
              :invalid="Boolean(phoneError)"
            />
            <p v-if="phoneError" class="modal-error">{{ phoneError }}</p>
          </div>

          <div class="modal-field">
            <label class="modal-label">Date of Birth</label>
            <input v-model="form.date_of_birth" type="date" class="modal-input" />
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-cancel-btn" @click="closeEdit">Cancel</button>
            <button type="submit" class="modal-save-btn" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from '@/Layouts/AccountLayout.vue';
import StatCard from '@/components/Account/StatCard.vue';
import AddressFields from '@/components/Account/AddressFields.vue';
import PhoneField from '@/components/Form/PhoneField.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import { toast } from '@steveyuowo/vue-hot-toast';
import { useAuthStore } from '@/Store/authStore';
import { CITIES, TYPES, blankAddress } from '@/constants/address';

const page = usePage();
const authStore = useAuthStore();

const addresses = ref(page.props.addresses || []);
const stats = ref(page.props.stats || {});

// The list comes back primary-first from the controller.
watch(
  () => page.props.addresses,
  (next) => { addresses.value = next || []; },
);

/*
 * Addresses are managed here rather than on a separate screen.
 *
 * `drafts` are unsaved new addresses; each is an independent form so more than
 * one can be written before saving. Exactly one saved address is primary, and
 * that is the one checkout fills itself in from.
 */
const drafts = ref([]);
const editingId = ref(null);
const editForm = ref(blankAddress());
const errors = ref({});
const busy = ref(false);

const isPrimary = (addr) => Number(addr.is_default) === 1;

function addDraft() {
  errors.value = {};
  drafts.value.push({
    ...blankAddress(),
    is_default: addresses.value.length === 0,
  });
}

function startEdit(addr) {
  errors.value = {};
  editingId.value = addr.id;
  editForm.value = {
    address: addr.address || '',
    city: addr.city || '',
    type: addr.type || 'home',
    is_default: isPrimary(addr),
  };
}

function cancelEdit() {
  editingId.value = null;
  errors.value = {};
}

/** Shared Inertia options: keep the page still, surface field errors. */
const requestOptions = (onDone) => ({
  preserveScroll: true,
  onStart: () => { busy.value = true; errors.value = {}; },
  onError: (e) => { errors.value = e; },
  onSuccess: () => { errors.value = {}; onDone?.(); },
  onFinish: () => { busy.value = false; },
});

function saveDraft(index) {
  router.post(route('address.store'), drafts.value[index], requestOptions(() => {
    drafts.value.splice(index, 1);
  }));
}

function saveEdit(addr) {
  router.put(route('address.update', addr.id), editForm.value, requestOptions(() => {
    editingId.value = null;
  }));
}

function makePrimary(addr) {
  if (isPrimary(addr)) return;
  router.post(route('address.primary', addr.id), {}, requestOptions());
}

function remove(addr) {
  if (!window.confirm('Remove this address?')) return;
  router.post(route('address.destroy', addr.id), {}, requestOptions());
}

const initial = computed(() => (authStore.user?.name || '?').trim().charAt(0).toUpperCase());

/* ------------------------------------------------------ profile photo -- */

const avatarInput = ref(null);
const uploadingAvatar = ref(false);
// A local preview so the new picture appears immediately, before the reload.
const avatarPreview = ref(null);

const avatar = computed(() => avatarPreview.value || authStore.user?.image || null);

function uploadAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 4 * 1024 * 1024) {
    toast.error('The picture must be 4MB or smaller.');
    event.target.value = '';
    return;
  }

  const previous = avatarPreview.value;
  avatarPreview.value = URL.createObjectURL(file);
  uploadingAvatar.value = true;

  router.post(route('account.profile.avatar'), { image: file }, {
    forceFormData: true,
    preserveScroll: true,
    onError: (errors) => {
      // Put the old picture back; the new one was never stored.
      avatarPreview.value = previous;
      toast.error(errors.image || 'Could not upload the picture.');
    },
    onFinish: () => {
      uploadingAvatar.value = false;
      event.target.value = '';
    },
  });
}

const isEditOpen = ref(false);
const saving = ref(false);
const form = ref({ name: '', email: '', phone: '', date_of_birth: '' });

// Reported by PhoneField, which checks the number against the selected
// country's numbering plan — the same check the checkout form uses.
const phoneValid = ref(false);
const phoneError = ref('');

const openEdit = () => {
  form.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
    date_of_birth: authStore.user?.date_of_birth || '',
  };
  phoneError.value = '';
  isEditOpen.value = true;
};

const closeEdit = () => {
  isEditOpen.value = false;
};

const submitProfile = () => {
  // The number is optional, but a number that was typed has to be a real one.
  if (form.value.phone && !phoneValid.value) {
    phoneError.value = 'Enter a valid phone number.';
    return;
  }

  phoneError.value = '';
  saving.value = true;

  router.put('/account/profile', form.value, {
    preserveScroll: true,
    onSuccess: () => {
      closeEdit();
    },
    onError: (errors) => {
      phoneError.value = errors.phone || '';
      toast.error(errors.phone || errors.email || 'Could not update profile.');
    },
    onFinish: () => { saving.value = false; },
  });
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-row {
  display: flex;
  gap: 10px;
}

.profile-summary-card {
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.sr-only-file {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.profile-avatar {
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  background: #d4e0c8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 40px;
  color: #2d4a2d;
}

.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-busy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(45, 74, 45, 0.55);
  color: #fff;
  font-size: 26px;
}

.profile-avatar-badge {
  cursor: pointer;
  border: 0;
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: #2d4a2d;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 3px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.1);
}

.profile-avatar-badge img {
  width: 13px;
  height: 13px;
}

.profile-avatar-badge:disabled { opacity: 0.6; cursor: progress; }

.profile-summary-info {
  flex: 1;
  min-width: 160px;
}

.profile-name {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #2c1a0e;
}

.profile-email {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #7a5c3e;
}

.profile-edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #efe5d0;
  border: 1px solid #e8d4b0;
  border-radius: 14px;
  padding: 9px 17px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2c1a0e;
  transition: background-color 0.15s ease;
}

.profile-edit-btn:hover {
  background: #e8d4b0;
}

.profile-edit-btn img {
  width: 14px;
  height: 14px;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.profile-field-label {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #7a5c3e;
  margin-bottom: 6px;
}

.profile-field-value {
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 17px;
  border: 1px solid rgba(44, 26, 14, 0.12);
  border-radius: 14px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
  background: #fff;
}

.address-card {
  background: #fefaf3;
  border: 1px solid #e8d4b0;
  border-radius: 16px;
  padding: 21px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2c1a0e;
}

.address-card-title img {
  width: 15px;
  height: 15px;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.address-empty {
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #7a5c3e;
}

/* ── Inline address manager ──────────────────────────────── */
.addr-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid #e8d4b0;
  border-radius: 12px;
  background: #fff;
}

.addr-item.is-primary { border-color: #356019; }
.addr-item.is-draft { background: #fdfaf4; border-style: dashed; }

.addr-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.addr-type {
  padding: 2px 10px;
  border-radius: 999px;
  background: #ecf1e8;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #356019;
}

.addr-primary-tag {
  padding: 2px 10px;
  border-radius: 999px;
  background: #356019;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}

.addr-head-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.addr-link {
  border: 0;
  background: none;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #7a5c3e;
  cursor: pointer;
}

.addr-link:hover { text-decoration: underline; }
.addr-link--danger { color: #b91c1c; }

.addr-line {
  margin: 0;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #4a3a2c;
}

.addr-line--strong { font-weight: 600; color: #2c1a0e; }
.addr-line--muted { font-size: 13px; color: #7a5c3e; }

.addr-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 13px;
  color: #7a5c3e;
  cursor: pointer;
}

.addr-primary input { accent-color: #356019; cursor: pointer; }

.addr-note {
  margin: 0;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #7a5c3e;
}

.addr-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.addr-btn {
  padding: 9px 18px;
  border: 1px solid #e8d4b0;
  border-radius: 9px;
  background: #fff;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #7a5c3e;
  cursor: pointer;
}

.addr-btn--save {
  border-color: #356019;
  background: #356019;
  color: #fff;
}

.addr-btn:disabled { opacity: 0.6; cursor: progress; }

.addr-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 11px;
  border: 1px dashed #cbb894;
  border-radius: 10px;
  background: transparent;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #356019;
  cursor: pointer;
}

.addr-add:hover { background: #f7efdd; }

@media (max-width: 640px) {
  /* Stacking three cards that hold one number each cost three screenfuls of
     scroll; they fit across the width instead. */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .profile-info-grid,
  .address-grid {
    grid-template-columns: 1fr;
  }

  .profile-summary-card {
    padding: 18px 16px;
  }

  /* Avatar, name and the edit button side by side leave the name no room. */
  .profile-summary-card {
    flex-wrap: wrap;
    row-gap: 14px;
  }

  .profile-edit-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Edit Profile modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 440px;
}

.modal-title {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: #2c1a0e;
  margin-bottom: 16px;
}

.modal-field {
  margin-bottom: 16px;
}

.modal-label {
  display: block;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #7a5c3e;
  margin-bottom: 6px;
}

.modal-error {
  margin: 5px 0 0;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 12px;
  color: #dc2626;
}

/* The phone input lives inside PhoneField, so scoped `.modal-input` cannot
   reach it — the same rules style it here so it matches the fields above and
   below. Left padding is left alone: intl-tel-input sets it from the flag. */
.modal-input,
.phone-field :deep(.iti__tel-input) {
  display: block;
  width: 100%;
  height: 46px;
  padding: 0 17px;
  border: 1px solid rgba(44, 26, 14, 0.12);
  border-radius: 14px;
  font-family: "DM Sans", "Poppins", sans-serif;
  font-size: 14px;
  color: #2c1a0e;
}

.phone-field.is-invalid :deep(.iti__tel-input) {
  border-color: #dc2626;
}

.phone-field :deep(.iti) {
  --iti-border-color: rgba(44, 26, 14, 0.12);
  --iti-country-selector-bg: #fff;
  --iti-hover-color: rgba(53, 96, 25, 0.06);
  --iti-icon-color: #7a5c3e;
}

.modal-input:focus {
  outline: none;
  border-color: #356019;
  box-shadow: 0 0 0 1px #356019;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.modal-cancel-btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  color: #7a5c3e;
  background: #efe5d0;
}

.modal-save-btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-family: "Manrope", "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: #356019;
}

.modal-save-btn:hover:not(:disabled) {
  background: #2a4d14;
}

.modal-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
