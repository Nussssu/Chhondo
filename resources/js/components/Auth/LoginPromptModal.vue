<script setup>
import ClientOnly from "@/components/ClientOnly.vue";
import { router } from "@inertiajs/vue3";
import { useAuthPromptStore } from "@/Store/authPromptStore";

const authPrompt = useAuthPromptStore();

const goToLogin = () => {
    authPrompt.close();
    router.visit("/login");
};

const goToRegister = () => {
    authPrompt.close();
    router.visit("/register");
};
</script>

<template>
    <ClientOnly><Teleport to="body">
        <Transition name="auth-prompt-fade">
            <div
                v-if="authPrompt.isOpen"
                class="auth-prompt-overlay"
                @click.self="authPrompt.close()"
            >
                <div class="auth-prompt-card" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        class="auth-prompt-close"
                        aria-label="Close"
                        @click="authPrompt.close()"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="auth-prompt-icon">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>

                    <h3 class="auth-prompt-title">চালিয়ে যেতে লগ ইন করুন</h3>
                    <p class="auth-prompt-message">{{ authPrompt.message }}</p>

                    <div class="auth-prompt-actions">
                        <button type="button" class="auth-prompt-btn primary" @click="goToLogin">
                            Log in
                        </button>
                        <button type="button" class="auth-prompt-btn secondary" @click="goToRegister">
                            Create an account
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport></ClientOnly>
</template>

<style scoped>
.auth-prompt-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
}

.auth-prompt-card {
    position: relative;
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 16px;
    padding: 32px 24px 24px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.auth-prompt-close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 9999px;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.auth-prompt-close:hover {
    background: #f3f4f6;
    color: #374151;
}

.auth-prompt-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto 16px;
    border-radius: 9999px;
    background: #ecf1e8;
    color: #356019;
}

.auth-prompt-title {
    font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.auth-prompt-message {
    font-size: 14px;
    line-height: 1.5;
    color: #6b7280;
    margin-bottom: 22px;
}

.auth-prompt-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.auth-prompt-btn {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.auth-prompt-btn.primary {
    background: #356019;
    color: #fff;
}

.auth-prompt-btn.primary:hover {
    background: #2a4d14;
}

.auth-prompt-btn.secondary {
    background: #fff;
    color: #356019;
    border: 1.5px solid #356019;
}

.auth-prompt-btn.secondary:hover {
    background: #ecf1e8;
}

.auth-prompt-fade-enter-active,
.auth-prompt-fade-leave-active {
    transition: opacity 0.2s ease;
}

.auth-prompt-fade-enter-from,
.auth-prompt-fade-leave-to {
    opacity: 0;
}
</style>
