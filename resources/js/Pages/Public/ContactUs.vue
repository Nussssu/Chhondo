<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import PageBlocks from "@/components/Page/PageBlocks.vue"
import { Head, router, usePage } from "@inertiajs/vue3"
import { computed, ref } from "vue"
import { toast } from "@steveyuowo/vue-hot-toast"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-vue-next"
import PhoneField from "@/components/Form/PhoneField.vue"

defineProps({
  // Wording for this page, editable in Content > Pages.
  texts: { type: Object, default: () => ({}) },
  intro: { type: Object, default: () => ({}) },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
})

// Contact details come from the one place they are edited — Settings › Store,
// mirrored on Content › Pages › Contact us — never from copy typed into a page.
const page = usePage()
const contact = computed(() => page.props.contact ?? {})

const socials = computed(() =>
  [
    { key: "facebook", label: "Facebook", url: contact.value.facebook },
    { key: "instagram", label: "Instagram", url: contact.value.instagram },
    { key: "tiktok", label: "TikTok", url: contact.value.tiktok },
    { key: "youtube", label: "YouTube", url: contact.value.youtube },
    { key: "x", label: "X", url: contact.value.x },
  ].filter((s) => s.url)
)

/** A phone number is only dialable once the spaces and dashes come out. */
const telHref = (value) => `tel:${String(value ?? "").replace(/[^\d+]/g, "")}`

const whatsappHref = computed(() => {
  const digits = String(contact.value.whatsapp ?? "").replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : null
})

const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
})

const errors = ref({})
const isSubmitting = ref(false)
// Reported by PhoneField, which checks the number against the selected
// country's numbering plan rather than just its length.
const phoneValid = ref(false)

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
  } else if (!phoneValid.value) {
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
    <title>{{ texts.t1 }}</title>
  </Head>
  <AppLayout>
    <section class="contact-page py-12 md:py-16">
      <div class="container max-w-6xl mx-auto px-4">
        <div class="text-center mb-9 md:mb-10">
          <h1 class="headline-1 text-[#3E3C3A]">{{ intro?.title || 'যোগাযোগ করুন' }}</h1>
          <p v-if="intro?.subtitle" class="body-1-r text-[#6E6C69] mt-3 leading-relaxed">
            {{ intro.subtitle }}
          </p>
          <!-- Written in the admin under Content › Pages › Contact us -->
          <div v-if="content" class="contact-intro mt-4" v-html="content"></div>
          <p v-else class="body-2-r text-[#696560] mt-4">{{ texts.t2 }}</p>
        </div>

        <div class="contact-grid">
          <!-- ── Left: the details, and where to find us ─────────── -->
          <aside class="contact-aside">
            <div class="contact-card rounded-2xl p-6 md:p-7">
              <h2 class="body-3-sb text-[#3E3C3A] mb-5">{{ texts.t3 }}</h2>

              <ul class="contact-list">
                <li v-if="contact.phone">
                  <span class="contact-ico"><Phone class="w-[17px] h-[17px]" /></span>
                  <div>
                    <span class="contact-term">{{ texts.t4 }}</span>
                    <a :href="telHref(contact.phone)" class="contact-value contact-link" dir="ltr">{{ contact.phone }}</a>
                  </div>
                </li>

                <li v-if="whatsappHref">
                  <span class="contact-ico"><MessageCircle class="w-[17px] h-[17px]" /></span>
                  <div>
                    <span class="contact-term">{{ texts.t5 }}</span>
                    <a :href="whatsappHref" target="_blank" rel="noopener" class="contact-value contact-link" dir="ltr">
                      {{ contact.whatsapp }}
                    </a>
                  </div>
                </li>

                <li v-if="contact.email">
                  <span class="contact-ico"><Mail class="w-[17px] h-[17px]" /></span>
                  <div>
                    <span class="contact-term">{{ texts.t6 }}</span>
                    <a :href="`mailto:${contact.email}`" class="contact-value contact-link">{{ contact.email }}</a>
                  </div>
                </li>

                <li v-if="contact.address">
                  <span class="contact-ico"><MapPin class="w-[17px] h-[17px]" /></span>
                  <div>
                    <span class="contact-term">{{ texts.t7 }}</span>
                    <span class="contact-value">{{ contact.address }}</span>
                  </div>
                </li>

                <li v-if="contact.hours">
                  <span class="contact-ico"><Clock class="w-[17px] h-[17px]" /></span>
                  <div>
                    <span class="contact-term">{{ texts.t8 }}</span>
                    <span class="contact-value">{{ contact.hours }}</span>
                  </div>
                </li>
              </ul>

              <div v-if="socials.length" class="contact-socials">
                <span class="contact-term">{{ texts.t9 }}</span>
                <div class="mt-2 flex flex-wrap gap-2">
                  <a
                    v-for="s in socials"
                    :key="s.key"
                    :href="s.url"
                    target="_blank"
                    rel="noopener"
                    class="contact-social"
                  >
                    {{ s.label }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Derived from the store address, so it follows whatever is saved -->
            <div v-if="contact.map" class="contact-map rounded-2xl">
              <iframe
                :src="contact.map"
                title="Store location"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              ></iframe>
            </div>
          </aside>

          <!-- ── Right: the enquiry form ─────────────────────────── -->
          <div class="contact-card rounded-2xl p-6 md:p-8">
            <h2 class="body-3-sb text-[#3E3C3A] mb-5">{{ texts.t10 }}</h2>
            <form @submit.prevent="submitForm" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="email" class="block body-1-sb text-[#403E3B] mb-2">{{ texts.t11 }}</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="example@email.com"
                  class="contact-input"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                  {{ errors.email }}
                </p>
              </div>

              <div>
                <label for="phone" class="block body-1-sb text-[#403E3B] mb-2">{{ texts.t12 }}</label>
                <PhoneField
                  id="phone"
                  v-model="form.phone"
                  v-model:valid="phoneValid"
                  :invalid="!!errors.phone"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
                  {{ errors.phone }}
                </p>
              </div>
            </div>

            <div>
              <label for="name" class="block body-1-sb text-[#403E3B] mb-2">{{ texts.t13 }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="আপনার সম্পূর্ণ নাম"
                class="contact-input"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label for="message" class="block body-1-sb text-[#403E3B] mb-2">{{ texts.t14 }}</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                placeholder="আপনার বার্তা এখানে লিখুন"
                class="contact-input resize-none"
                :class="{ 'border-red-500': errors.message }"
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-500">
                {{ errors.message }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-[#1D6E13] hover:bg-[#16580f] text-white body-2-sb py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting">{{ texts.t15 }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>{{ texts.t16 }}</span>
            </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Widgets added in Content › Pages -->
    <PageBlocks :blocks="blocks" />
  </AppLayout>
</template>

<style scoped>
.contact-intro {
  font-family: 'Hind Siliguri', 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 28px;
  color: #696560;
}

.contact-intro :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  color: #3E3C3A;
  margin: 12px 0 8px;
}

.contact-intro :deep(p) {
  margin-bottom: 10px;
}

.contact-page {
  background-color: #fffaf4;
}

/* Details and map on the left, the form on the right; one column on mobile,
   where the form matters more than the address and so comes first. */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}

@media (min-width: 1024px) {
  .contact-grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 28px;
  }
}

.contact-aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
  order: 2;
}

@media (min-width: 1024px) {
  .contact-aside { order: 0; position: sticky; top: 24px; }
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contact-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #f1f6ed;
  color: #1d6e13;
}

.contact-term {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .02em;
  color: #8d8880;
}

.contact-value {
  display: block;
  margin-top: 2px;
  font-size: 15px;
  line-height: 24px;
  color: #3f3d39;
  word-break: break-word;
}

.contact-link:hover {
  color: #1d6e13;
  text-decoration: underline;
}

.contact-socials {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eee4d8;
}

.contact-social {
  padding: 5px 13px;
  border: 1px solid #eadfce;
  border-radius: 999px;
  background: #fffaf4;
  font-size: 13px;
  color: #5f5d59;
  transition: border-color .2s ease, color .2s ease;
}

.contact-social:hover {
  border-color: #1d6e13;
  color: #1d6e13;
}

.contact-map {
  overflow: hidden;
  border: 1px solid #eee4d8;
  background: #fff;
}

.contact-map iframe {
  display: block;
  width: 100%;
  height: 280px;
  border: 0;
}

.contact-card {
  background-color: #ffffff;
  border: 1px solid #eee4d8;
}

/* The phone input lives inside PhoneField, so scoped `.contact-input` cannot
   reach it — it is styled here by the same rules to stay identical. Its
   left padding is left alone: intl-tel-input sets it from the flag width. */
.contact-input,
.phone-field :deep(.iti__tel-input) {
  width: 100%;
  border: 1px solid #eadfce;
  background-color: #fffaf4;
  border-radius: 8px;
  padding: 12px 14px;
  color: #3f3d39;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.contact-input::placeholder,
.phone-field :deep(.iti__tel-input)::placeholder {
  color: #9f9b95;
}

.contact-input:focus,
.phone-field :deep(.iti__tel-input):focus {
  border-color: #c9bfae;
  box-shadow: 0 0 0 3px rgba(201, 191, 174, 0.2);
}

.phone-field.is-invalid :deep(.iti__tel-input) {
  border-color: #ef4444;
}

/* Match the field's own palette rather than the library's grey default. */
.phone-field :deep(.iti) {
  --iti-border-color: #eadfce;
  --iti-country-selector-bg: #fffaf4;
  --iti-hover-color: rgba(53, 96, 25, 0.06);
  --iti-icon-color: #6b6660;
}
</style>
