<template>
  <Head><title>Admin Login</title></Head>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo" role="img" aria-label="Chhondo">
        <img :src="'/assets/chhondo/logo-mark-dark.svg'" alt="" class="login-logo-mark" />
        <img :src="'/assets/chhondo/logo-word-dark.svg'" alt="" class="login-logo-word" />
      </div>
      <div class="login-title">Welcome back</div>
      <div class="login-subtitle">Sign in to manage your store</div>

      <div v-if="status" class="login-status">{{ status }}</div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': form.errors.email }"
            placeholder="Enter email"
            autofocus
          >
          <div v-if="form.errors.email" class="invalid-feedback">{{ form.errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <div class="input-group">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': form.errors.password }"
              placeholder="Enter password"
            >
            <span class="input-group-text bg-transparent" id="show_hide_password" @click="showPassword = !showPassword">
              <i class="bx" :class="showPassword ? 'bx-show' : 'bx-hide'"></i>
            </span>
          </div>
          <div v-if="form.errors.password" class="invalid-feedback d-block">{{ form.errors.password }}</div>
        </div>

        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="form.remember" id="remember">
            <label class="form-check-label" for="remember" style="font-size: 14px; color: #4b5563;">Remember me</label>
          </div>
          <a v-if="canResetPassword" :href="route('password.request')" class="forgot-link">Forgot password?</a>
        </div>

        <button type="submit" class="btn btn-login w-100" :disabled="form.processing">
          {{ form.processing ? 'Signing in...' : 'Log in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'

defineProps({
  canResetPassword: { type: Boolean, default: false },
  status: { type: String, default: null },
})

const showPassword = ref(false)

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

function submit() {
  form.post(route('login'))
}
</script>

<style scoped>
.login-page {
  --brand-green: #252f17;
  --brand-green-dark: #1a2110;
  --brand-forest: #1a2110;
  --brand-cream: #FAF5E9;
  --brand-danger: #F9461C;

  font-family: 'Poppins', 'Hind Siliguri', sans-serif;
  background: var(--brand-cream);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(26, 33, 16, 0.08);
  padding: 40px 36px;
  margin: 24px;
}

/* The storefront logo, a third larger: mark over word */
.login-logo {
  display: grid;
  grid-template-rows: 56px 9px;
  justify-items: center;
  align-items: center;
  gap: 3px;
  margin: 0 auto 24px;
}
.login-logo-mark { width: 64px; height: 56px; display: block; }
.login-logo-word { width: 76px; height: 9px; display: block; }

.login-title {
  font-weight: 700;
  font-size: 24px;
  color: var(--brand-forest);
  text-align: center;
  margin-bottom: 4px;
}

.login-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 28px;
}

.login-status {
  background: #ecf6ea;
  color: var(--brand-green-dark);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  text-align: center;
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  font-size: 14px;
  color: #1a1a1a;
}

.form-control {
  height: 48px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 15px;
}

.form-control:focus {
  border-color: var(--brand-green);
  box-shadow: 0 0 0 0.2rem rgba(37, 47, 23, 0.15);
}

.invalid-feedback {
  display: block;
  color: var(--brand-danger);
  font-size: 12px;
}

.form-check-input:checked {
  background-color: var(--brand-green);
  border-color: var(--brand-green);
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--brand-green);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
  color: var(--brand-green-dark);
}

.btn-login {
  font-family: 'Poppins', 'Li Ador Noirrit', sans-serif;
  font-weight: 700;
  height: 48px;
  border-radius: 10px;
  background: var(--brand-green);
  border: none;
  color: #fff;
  font-size: 15px;
}

.btn-login:hover:not(:disabled) {
  background: var(--brand-green-dark);
  color: #fff;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

#show_hide_password {
  cursor: pointer;
  color: #9ca3af;
}

#show_hide_password:hover {
  color: #4b5563;
}
</style>
