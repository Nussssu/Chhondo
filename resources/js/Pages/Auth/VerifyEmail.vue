<template>
  <Head>
    <title>Verify email</title>
  </Head>

  <AuthShowcaseLayout>
    <div class="auth-form">
      <h1 class="auth-title">Verify your email</h1>
      <p class="auth-subtitle">
        Thanks for signing up! Before getting started, could you verify your email address by
        clicking the link we just emailed to you? If you didn't receive it, we'll gladly send
        another.
      </p>

      <div v-if="status === 'verification-link-sent'" class="auth-status">
        A new verification link has been sent to the email address you provided.
      </div>

      <div class="auth-actions">
        <button type="button" class="auth-submit" :disabled="resendForm.processing" @click="resend">
          {{ resendForm.processing ? 'Sending...' : 'Resend Verification Email' }}
        </button>
        <button type="button" class="auth-link-btn" @click="logout">Log Out</button>
      </div>
    </div>
  </AuthShowcaseLayout>
</template>

<script setup>
import AuthShowcaseLayout from '@/components/Auth/AuthShowcaseLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'

defineProps({
  status: { type: String, default: null },
})

const resendForm = useForm({})
const logoutForm = useForm({})

function resend() {
  resendForm.post('/email/verification-notification')
}

function logout() {
  logoutForm.post('/logout')
}
</script>

<style scoped>
.auth-title {
  font-family: "Poppins", sans-serif;
  font-size: 32px;
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
  margin-bottom: 28px;
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

.auth-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
}

.auth-submit:hover:not(:disabled) {
  background: #2a4d14;
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-link-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.auth-link-btn:hover {
  color: #1a1a1a;
}
</style>
