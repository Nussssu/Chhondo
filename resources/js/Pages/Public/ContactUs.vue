<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head, router } from "@inertiajs/vue3"
import { computed, ref } from "vue"
import { on, plain } from "@/utils/cms"
import { toast } from "@steveyuowo/vue-hot-toast"

const props = defineProps({
  // Content › Pages › Contact us: the heading and the line under it come from
  // "Page header", the form's wording from "Form".
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
})

const t = computed(() => props.texts || {})

const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
})

const errors = ref({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = "নাম লিখুন"
  }

  if (!form.value.email.trim()) {
    errors.value.email = "ইমেইল লিখুন"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "সঠিক ইমেইল দিন"
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = "ফোন নম্বর লিখুন"
  } else if (!/^\+?[0-9]{8,15}$/.test(form.value.phone.replace(/[\s()-]/g, ""))) {
    errors.value.phone = "সঠিক ফোন নম্বর দিন"
  }

  if (!form.value.message.trim()) {
    errors.value.message = "বার্তা লিখুন"
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    toast.error("সব তথ্য পূরণ করুন")
    return
  }

  isSubmitting.value = true

  router.post("/contact-us", form.value, {
    onSuccess: () => {
      form.value = { name: "", email: "", phone: "", message: "" }
    },
    onError: (errors) => {
      toast.error(Object.values(errors)[0] || "বার্তা পাঠাতে ব্যর্থ হয়েছে")
    },
    onFinish: () => { isSubmitting.value = false },
  })
}
</script>

<template>
  <Head>
    <title>{{ plain(t.tab_title) }}</title>
  </Head>
  <AppLayout>
    <!-- Figma "Contact Us": title, line, one 900px form card -->
    <section class="contact-page">
      <div class="container">
        <div class="contact-head">
          <h1 class="contact-title">{{ intro.title || plain(t.tab_title) }}</h1>
          <p v-if="intro.subtitle" class="contact-sub">{{ intro.subtitle }}</p>
        </div>

        <div v-if="on(t.form_show)" class="contact-card">
          <h2 class="contact-card-title">{{ t.card_title }}</h2>
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="contact-row">
              <div>
                <label for="email" class="contact-label">{{ t.email_label }}</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :placeholder="t.email_placeholder"
                  class="contact-input"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                  {{ errors.email }}
                </p>
                <p v-else-if="on(t.email_hint_show) && t.email_hint" class="contact-hint">{{ t.email_hint }}</p>
              </div>

              <div>
                <label for="phone" class="contact-label">{{ t.phone_label }}</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  inputmode="tel"
                  :placeholder="t.phone_placeholder"
                  class="contact-input contact-input--latin"
                  :class="{ 'border-red-500': errors.phone }"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
                  {{ errors.phone }}
                </p>
              </div>
            </div>

            <div>
              <label for="name" class="contact-label">{{ t.name_label }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :placeholder="t.name_placeholder"
                class="contact-input"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label for="message" class="contact-label">{{ t.message_label }}</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                :placeholder="t.message_placeholder"
                class="contact-input contact-textarea resize-none"
                :class="{ 'border-red-500': errors.message }"
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-500">
                {{ errors.message }}
              </p>
            </div>

            <button type="submit" class="contact-submit" :disabled="isSubmitting">
              {{ isSubmitting ? t.sending_label : t.submit_label }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.contact-page { padding: 64px 0 96px; background: #fff; }

.contact-head { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 40px; text-align: center; }
.contact-title {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}
.contact-sub {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}

/* 900 wide, r16, 32px padding, the shared soft shadow */
.contact-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, .12), 0 2px 6px -2px rgba(0, 0, 0, .03);
}
.contact-card-title {
  margin-bottom: 20px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: #3c3834;
}
.contact-form { display: flex; flex-direction: column; gap: 20px; }
.contact-row { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 768px) { .contact-row { grid-template-columns: 1fr 1fr; } }

.contact-label {
  display: block;
  margin-bottom: 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1a1817;
}

/* Black/50 fill, Black/200 hairline, r8, 56px */
.contact-input,
.contact-page :deep(.iti__tel-input) {
  width: 100%;
  height: 56px;
  padding: 16px;
  border: 1px solid #e4e1e0;
  border-radius: 8px;
  background: #f3f3f3;
  font-family: "Poppins", "Li Ador Noirrit", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #1a1817;
  outline: none;
  transition: border-color .2s ease, background-color .2s ease, box-shadow .2s ease;
}
.contact-input--latin,
.contact-input--latin::placeholder { font-family: "Poppins", sans-serif; }
.contact-input:focus,
.contact-page :deep(.iti__tel-input):focus { border-color: #d6af51; background: #fff; box-shadow: 0 0 0 3px rgba(214, 175, 81, .18); }
.contact-input::placeholder { color: #9c9591; font-family: "Li Ador Noirrit", "Poppins", sans-serif; }
.contact-textarea { height: 141px; }

/* The site's primary button: Olive/700, r8, 48px, Li Ador 16/24 */
.contact-submit {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #1a2110;
  color: #fff;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;
  transition: background-color .2s ease;
}
.contact-submit:hover:not(:disabled) { background: #252f17; }
.contact-submit:disabled { opacity: .7; cursor: progress; }
.contact-hint {
  margin-top: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #6d6560;
}

@media (max-width: 767px) {
  .contact-page { padding: 32px 0 48px; }
  .contact-page .container { padding-inline: 20px; }
  .contact-title { font-size: 36px; line-height: 44px; }
  .contact-card { padding: 20px; }
  .contact-card-title { font-size: 22px; line-height: 30px; }
}
</style>
