<template>
  <Head>
    <title>Log in</title>
  </Head>

  <AuthShowcaseLayout :reviews="reviews">
    <div class="auth-form">
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to your account to continue shopping</p>

      <div v-if="status" class="auth-status" role="status">{{ status }}</div>

      <form @submit.prevent="handleSubmit" class="auth-fields">
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
          <label for="password" class="auth-label">Password</label>
          <div class="auth-input-wrap">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
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

        <div class="auth-row">
          <label class="auth-remember">
            <input type="checkbox" v-model="form.remember" class="auth-checkbox" />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" class="auth-link">Forgot password?</Link>
        </div>

        <button type="submit" class="auth-submit" :disabled="form.processing">
          {{ form.processing ? 'Logging in...' : 'Log in' }}
        </button>

        <p class="auth-switch">
          Don't have an account?
          <Link href="/register" class="auth-link">Create one</Link>
        </p>
      </form>
    </div>
  </AuthShowcaseLayout>
</template>

<script setup>
import AuthShowcaseLayout from '@/components/Auth/AuthShowcaseLayout.vue'
import { computed, ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { Link, useForm, Head } from '@inertiajs/vue3'

defineProps({
  reviews: { type: Array, default: () => [] },
  // Carried over from registration, or any other page that hands the visitor
  // here with something to say.
  status: { type: String, default: null },
})

const showPassword = ref(false)

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

// Inertia replaces form.errors wholesale (clearErrors() builds a new object,
// and every submit clears before applying the server's errors), so capturing
// `form.errors` once left this page pointing at a detached object and no
// validation message ever rendered. A computed re-reads it each time.
const errors = computed(() => form.errors)

const handleSubmit = () => {
  form.post('/auth/login')
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

.auth-status {
  background: #ecf1e8;
  color: #234011;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  text-align: center;
  margin-bottom: 24px;
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

.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}

.auth-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #356019;
  cursor: pointer;
}

.auth-link {
  color: #356019;
  font-weight: 600;
  font-size: 14px;
}

.auth-link:hover {
  text-decoration: underline;
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

.auth-switch {
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  margin-top: 8px;
}
</style>
