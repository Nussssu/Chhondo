<template>
  <Head>
    <title>Create account</title>
  </Head>

  <AuthShowcaseLayout :reviews="reviews">
    <div class="auth-form">
      <h1 class="auth-title">Create account</h1>
      <p class="auth-subtitle">Create an account to continue shopping</p>

      <form @submit.prevent="handleSubmit" class="auth-fields">
        <div class="auth-field">
          <label for="name" class="auth-label">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            placeholder="Your full name"
            class="auth-input"
            :class="{ 'has-error': errors.name }"
          />
          <p v-if="errors.name" class="auth-error">{{ errors.name }}</p>
        </div>

        <div class="auth-field">
          <label for="email" class="auth-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="auth-input"
            :class="{ 'has-error': errors.email }"
          />
          <p v-if="errors.email" class="auth-error">{{ errors.email }}</p>
        </div>

        <div class="auth-field">
          <label for="phone" class="auth-label">Phone number</label>
          <PhoneField
            id="phone"
            v-model="form.phone"
            v-model:valid="phoneValid"
            :invalid="!!errors.phone"
          />
          <p v-if="errors.phone" class="auth-error">{{ errors.phone }}</p>
        </div>

        <div class="auth-grid">
          <div class="auth-field">
            <label for="password" class="auth-label">Password</label>
            <div class="auth-input-wrap">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="At least 8 characters"
                class="auth-input"
                :class="{ 'has-error': errors.password }"
              />
              <button type="button" class="auth-eye" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="auth-error">{{ errors.password }}</p>
          </div>

          <div class="auth-field">
            <label for="password_confirmation" class="auth-label">Confirm Password</label>
            <div class="auth-input-wrap">
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                class="auth-input"
              />
              <button type="button" class="auth-eye" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                <EyeIcon v-if="!showConfirm" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="auth-submit" :disabled="form.processing">
          {{ form.processing ? 'Creating account...' : 'Create account' }}
        </button>

        <p class="auth-switch">
          Already have an account?
          <Link href="/login" class="auth-link">Log in</Link>
        </p>
      </form>
    </div>
  </AuthShowcaseLayout>
</template>

<script setup>
import AuthShowcaseLayout from '@/components/Auth/AuthShowcaseLayout.vue'
import PhoneField from '@/components/Form/PhoneField.vue'
import { computed, ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { Link, useForm, Head } from '@inertiajs/vue3'

defineProps({
  reviews: { type: Array, default: () => [] },
})

const showPassword = ref(false)
const showConfirm = ref(false)

// Reported by PhoneField, which checks the number against the selected
// country's numbering plan rather than just its length. The server applies the
// same rule; this only saves a round trip.
const phoneValid = ref(false)

const form = useForm({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
})

// Inertia replaces form.errors wholesale (clearErrors() builds a new object,
// and every submit clears before applying the server's errors), so capturing
// `form.errors` once left this page pointing at a detached object and no
// validation message ever rendered. A computed re-reads it each time.
const errors = computed(() => form.errors)

const handleSubmit = () => {
  if (!form.phone.trim()) {
    form.setError('phone', 'Enter your phone number')
    return
  }

  if (!phoneValid.value) {
    form.setError('phone', 'Enter a valid phone number')
    return
  }

  form.clearErrors('phone')
  form.post('/auth/register')
}
</script>

<style scoped>
.auth-title {
  font-family: "Poppins", sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  line-height: 1.2;
}

.auth-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 15px;
  margin-top: 8px;
  margin-bottom: 32px;
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

@media (min-width: 480px) {
  .auth-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-field {
  display: flex;
  flex-direction: column;
}

.auth-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-input-wrap {
  position: relative;
}

/* The phone input lives inside PhoneField, so scoped `.auth-input` cannot
   reach it — it is styled here by the same rules to stay identical. Its
   left padding is left alone: intl-tel-input sets it from the flag width. */
.auth-input,
.phone-field :deep(.iti__tel-input) {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s ease;
}

.auth-input-wrap .auth-input {
  padding-right: 44px;
}

.auth-input:focus,
.phone-field :deep(.iti__tel-input):focus {
  border-color: #356019;
}

.auth-input.has-error,
.phone-field.is-invalid :deep(.iti__tel-input) {
  border-color: #f9461c;
}

.auth-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
}

.auth-eye:hover {
  color: #4b5563;
}

.auth-error {
  margin-top: 6px;
  font-size: 12px;
  color: #f9461c;
}

.auth-submit {
  width: 100%;
  height: 50px;
  background: #356019;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 4px;
}

.auth-submit:hover:not(:disabled) {
  background: #2a4d14;
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-link {
  color: #356019;
  font-weight: 600;
  font-size: 14px;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-switch {
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  margin-top: 8px;
}
</style>
