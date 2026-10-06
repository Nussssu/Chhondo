<template>
  <Head>
    <title>আমার অ্যাকাউন্ট</title>
  </Head>

  <AccountLayout>
    <div class="profile-page">
      <div class="stat-row">
        <StatCard :value="stats.totalOrders ?? 0" label="মোট অর্ডার" />
        <StatCard :value="stats.wishlistItems ?? 0" label="উইশলিস্ট আইটেম" />
        <StatCard :value="stats.savedAddresses ?? 0" label="সংরক্ষিত ঠিকানা" />
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

        <!-- Figma: a dark "Back to Shop" button with a pencil icon -->
        <Link href="/shop" class="profile-edit-btn">
          <img :src="'/assets/images/account/edit-pencil.svg'" alt="" /> Back to Shop</Link>
      </div>

      <!-- Figma: details and delivery address in one card. Each field opens
           its editor, so editing stays where it was. -->
      <div class="profile-details-card">
        <div class="profile-info-grid">
          <div class="profile-field">
            <p class="profile-field-label">নাম</p>
            <button type="button" class="profile-field-value" aria-label="নাম এডিট করুন" @click="openEdit">{{ authStore.user?.name }}</button>
          </div>
          <div class="profile-field">
            <p class="profile-field-label">ই-মেইল অ্যাড্রেস</p>
            <button type="button" class="profile-field-value" aria-label="ই-মেইল এডিট করুন" @click="openEdit">{{ authStore.user?.email }}</button>
          </div>
          <div class="profile-field">
            <p class="profile-field-label">ফোন নম্বর</p>
            <button type="button" class="profile-field-value" aria-label="ফোন নম্বর এডিট করুন" @click="openEdit">{{ authStore.user?.phone }}</button>
          </div>
          <div class="profile-field">
            <p class="profile-field-label">জন্ম তারিখ</p>
            <button type="button" class="profile-field-value" aria-label="জন্ম তারিখ এডিট করুন" @click="openEdit">{{ authStore.user?.date_of_birth }}</button>
          </div>
        </div>

        <p class="address-card-title">
          <img :src="'/assets/images/account/address-pin.svg'" alt="" />
          ডেলিভারি ঠিকানা
        </p>

        <!-- The primary address, laid out as the Figma fields -->
        <template v-if="!managingAddress">
          <div class="profile-field">
            <p class="profile-field-label">বিস্তারিত ঠিকানা</p>
            <button type="button" class="profile-field-value" aria-label="ঠিকানা এডিট করুন" @click="openAddressManager">{{ primaryAddress?.address }}</button>
          </div>
          <div class="profile-address-row">
            <div class="profile-field">
              <p class="profile-field-label">শহর</p>
              <button type="button" class="profile-field-value" aria-label="শহর এডিট করুন" @click="openAddressManager">{{ CITIES_BN[primaryAddress?.city] || '' }}</button>
            </div>
            <div class="profile-field">
              <p class="profile-field-label">পোস্টাল কোড</p>
              <button type="button" class="profile-field-value" aria-label="ঠিকানা এডিট করুন" @click="openAddressManager"></button>
            </div>
          </div>
        </template>

        <!-- The address manager, as before -->
        <div v-else class="address-card">
          <p v-if="!addresses.length && !drafts.length" class="address-empty">
            এখনো কোনো ঠিকানা সেভ করা নেই — নিচে যোগ করুন, চেকআউটে এটিই বসে যাবে।
          </p>

          <!-- Saved addresses -->
          <div v-for="addr in addresses" :key="addr.id" class="addr-item" :class="{ 'is-primary': isPrimary(addr) }">
            <template v-if="editingId === addr.id">
              <AddressFields v-model="editForm" :errors="errors" />
              <div class="addr-actions">
                <button type="button" class="addr-btn addr-btn--save" :disabled="busy" @click="saveEdit(addr)">
                  {{ busy ? 'সেভ হচ্ছে…' : 'সেভ করুন' }}
                </button>
                <button type="button" class="addr-btn" @click="cancelEdit">বাতিল</button>
              </div>
            </template>

            <template v-else>
              <div class="addr-head">
                <span class="addr-type">{{ TYPES[addr.type] || 'বাসা' }}</span>
                <span v-if="isPrimary(addr) && addresses.length > 1" class="addr-primary-tag">প্রাইমারি</span>
                <div class="addr-head-actions">
                  <button type="button" class="addr-link" @click="startEdit(addr)">এডিট</button>
                  <button type="button" class="addr-link addr-link--danger" @click="remove(addr)">মুছুন</button>
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
                <span>প্রাইমারি হিসেবে রাখুন — চেকআউটে এটিই বসবে</span>
              </label>
            </template>
          </div>

          <!-- New addresses being written -->
          <div v-for="(draft, i) in drafts" :key="`draft-${i}`" class="addr-item is-draft">
            <AddressFields v-model="drafts[i]" :errors="i === 0 ? errors : {}" />
            <label v-if="addresses.length" class="addr-primary">
              <input v-model="draft.is_default" type="checkbox" />
              <span>এটিকে আমার প্রাইমারি ঠিকানা করুন</span>
            </label>
            <p v-else class="addr-note">এটিই হবে আপনার প্রাইমারি ঠিকানা।</p>
            <div class="addr-actions">
              <button type="button" class="addr-btn addr-btn--save" :disabled="busy" @click="saveDraft(i)">
                {{ busy ? 'সেভ হচ্ছে…' : 'ঠিকানা সেভ করুন' }}
              </button>
              <button type="button" class="addr-btn" @click="drafts.splice(i, 1)">বাতিল</button>
            </div>
          </div>

          <button type="button" class="addr-add" @click="addDraft">
            <Plus :size="15" />
            {{ addresses.length ? 'আরেকটি ঠিকানা যোগ করুন' : 'ঠিকানা যোগ করুন' }}
          </button>

          <button type="button" class="addr-btn" @click="closeAddressManager">বন্ধ করুন</button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <h2 class="modal-title">Edit Profile</h2>

        <form @submit.prevent="submitProfile">
          <div class="modal-field">
            <label class="modal-label">নাম</label>
            <input v-model="form.name" type="text" class="modal-input" placeholder="সম্পূর্ণ নাম" />
          </div>

          <div class="modal-field">
            <label class="modal-label">ই-মেইল অ্যাড্রেস</label>
            <input v-model="form.email" type="email" class="modal-input" placeholder="you@example.com" />
          </div>

          <div class="modal-field">
            <label class="modal-label">ফোন নম্বর</label>
            <PhoneField
              v-model="form.phone"
              v-model:valid="phoneValid"
              :invalid="Boolean(phoneError)"
            />
            <p v-if="phoneError" class="modal-error">{{ phoneError }}</p>
          </div>

          <div class="modal-field">
            <label class="modal-label">জন্ম তারিখ</label>
            <input v-model="form.date_of_birth" type="date" class="modal-input" />
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-cancel-btn" @click="closeEdit">বাতিল</button>
            <button type="submit" class="modal-save-btn" :disabled="saving">
              {{ saving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন' }}
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
import { Head, Link, router, usePage } from '@inertiajs/vue3';
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

// The Figma card shows the primary address as fields; clicking one opens the
// manager below it.
const CITIES_BN = { inside: 'ঢাকার ভেতরে', outside: 'ঢাকার বাইরে' };
const primaryAddress = computed(() => addresses.value.find(isPrimary) || addresses.value[0] || null);
const managingAddress = ref(false);

function openAddressManager() {
  managingAddress.value = true;
  if (!addresses.value.length && !drafts.value.length) addDraft();
}

function closeAddressManager() {
  managingAddress.value = false;
  editingId.value = null;
  drafts.value = [];
  errors.value = {};
}

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
    toast.error('ছবির আকার ৪MB বা তার কম হতে হবে।');
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
      toast.error(errors.image || 'ছবি আপলোড করা যায়নি।');
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
      toast.error(errors.phone || errors.email || 'প্রোফাইল আপডেট করা যায়নি।');
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

/* ===== Figma "My Profile" ===== */
.profile-page { gap: 20px; }
.stat-row { gap: 20px; }

.profile-summary-card,
.profile-details-card {
  padding: 24px;
  border: 0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.profile-summary-card { gap: 20px; flex-wrap: nowrap; }

/* Avatar 80px, Olive grey; camera badge 28px Olive/500 */
.profile-avatar { background: #cbcdc7; color: #1f2814; font: 600 40px/32px "Poppins", sans-serif; }
.profile-avatar-badge {
  background: #252f17;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, .03), 0 4px 16px -4px rgba(0, 0, 0, .12);
}
.profile-name { margin: 0; font: 600 24px/32px "Poppins", "Li Ador Noirrit", sans-serif; color: #2c1a0e; }
.profile-email { margin: 0; font: 400 14px/20px "DM Sans", "Poppins", sans-serif; color: #3c3834; }

/* Dark 44px button, r8, 16px sides, 24px icon 8px from the label */
.profile-edit-btn {
  margin-left: auto;
  flex-shrink: 0;
  height: 44px;
  padding: 0 16px;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  background: #1a2110;
  color: #fff;
  font: 600 16px/24px "Poppins", "Li Ador Noirrit", sans-serif;
  white-space: pre;
  cursor: pointer;
}
.profile-edit-btn:hover { background: #252f17; }
.profile-edit-btn img { width: 24px; height: 24px; filter: brightness(0) invert(1); }

/* One card: 24px padding, 20px between rows */
.profile-details-card { display: flex; flex-direction: column; gap: 20px; }
.profile-info-grid { gap: 20px 12px; }
.profile-address-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.profile-field { display: flex; flex-direction: column; gap: 8px; }
.profile-field-label {
  margin: 0;
  font: 600 16px/24px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  letter-spacing: 0;
  text-transform: none;
  color: #1a1817;
}
.profile-field-value {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  background: #f3f3f3;
  font: 400 16px/24px "Poppins", "Li Ador Noirrit", sans-serif;
  color: #9c9591;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.profile-field-value:hover { border-color: #d1cdca; }
.address-card-title {
  margin: 0;
  gap: 8px;
  font: 600 14px/20px "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  color: #1a1817;
}
.address-card-title img { width: 15px; height: 15px; }

/* The manager keeps its own look, without a second card around it */
.profile-details-card .address-card { padding: 0; border: 0; background: transparent; }

@media (max-width: 640px) {
  .stat-row { gap: 10px; }
  .profile-summary-card { flex-wrap: wrap; padding: 18px 16px; }
  .profile-details-card { padding: 18px 16px; }
  .profile-edit-btn { margin-left: 0; width: 100%; justify-content: center; }
  .profile-address-row { grid-template-columns: 1fr; }
}
</style>
