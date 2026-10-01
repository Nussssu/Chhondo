<template>
  <Head>
    <title>Reset password</title>
  </Head>

  <AuthShowcaseLayout>
    <div class="auth-form">
      <h1 class="auth-title">Reset password</h1>
      <p class="auth-subtitle">Choose a new password for your account</p>

      <form @submit.prevent="submit" class="auth-fields">
        <div class="auth-field">
          <label for="email" class="auth-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            placeholder="you@example.com"
            class="auth-input"
            :class="{ 'has-error': form.errors.email }"
            autofocus
          />
          <p v-if="form.errors.email" class="auth-error">{{ form.errors.email }}</p>
        </div>

        <div class="auth-field">
          <label for="password" class="auth-label">New Password</label>
          <div class="auth-input-wrap">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="At least 8 characters"
              class="auth-input"
              :class="{ 'has-error': form.errors.password }"
            />
            <button type="button" class="auth-eye" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="form.errors.password" class="auth-error">{{ form.errors.password }}</p>
        </div>

        <div class="auth-field">
          <label for="password_confirmation" class="auth-label">Confirm Password</label>
          <div class="auth-input-wrap">
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              :type="showConfirm ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Re-enter your new password"
              class="auth-input"
            />
            <button type="button" class="auth-eye" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
              <EyeIcon v-if="!showConfirm" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="form.errors.password_confirmation" class="auth-error">{{ form.errors.password_confirmation }}</p>
        </div>

        <button type="submit" class="auth-submit" :disabled="form.processing">
          {{ form.processing ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </AuthShowcaseLayout>
</template>

<script setup>
import AuthShowcaseLayout from '@/components/Auth/AuthShowcaseLayout.vue'
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { Head, useForm } from '@inertiajs/vue3'

const props = defineProps({
  email: { type: String, default: '' },
  token: { type: String, required: true },
})

const showPassword = ref(false)
const showConfirm = ref(false)

const form = useForm({
  token: props.token,
  email: props.email,
  password: '',
  password_confirmation: '',
})

function submit() {
  form.post('/reset-password')
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

.auth-input {
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

.auth-input:focus {
  border-color: #356019;
}

.auth-input.has-error {
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
</style>
