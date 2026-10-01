<template>
  <Head>
    <title>Forgot password</title>
  </Head>

  <AuthShowcaseLayout>
    <div class="auth-form">
      <h1 class="auth-title">Forgot your password?</h1>
      <p class="auth-subtitle">No problem. Enter your email and we'll send you a link to reset it.</p>

      <div v-if="status" class="auth-status">{{ status }}</div>

      <form @submit.prevent="submit" class="auth-fields">
        <div class="auth-field">
          <label for="email" class="auth-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="auth-input"
            :class="{ 'has-error': form.errors.email }"
            autofocus
          />
          <p v-if="form.errors.email" class="auth-error">{{ form.errors.email }}</p>
        </div>

        <button type="submit" class="auth-submit" :disabled="form.processing">
          {{ form.processing ? 'Sending...' : 'Email Password Reset Link' }}
        </button>

        <p class="auth-switch">
          Remembered your password?
          <Link href="/login" class="auth-link">Log in</Link>
        </p>
      </form>
    </div>
  </AuthShowcaseLayout>
</template>

<script setup>
import AuthShowcaseLayout from '@/components/Auth/AuthShowcaseLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'

defineProps({
  status: { type: String, default: null },
})

const form = useForm({
  email: '',
})

function submit() {
  form.post('/forgot-password')
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

.auth-input:focus {
  border-color: #356019;
}

.auth-input.has-error {
  border-color: #f9461c;
}

.auth-error {
  margin-top: 6px;
  font-size: 12px;
  color: #f9461c;
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
