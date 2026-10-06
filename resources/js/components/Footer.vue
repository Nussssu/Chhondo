<script setup>
import { computed } from "vue"
import { Link, usePage } from "@inertiajs/vue3"

const page = usePage()
const siteInfo = computed(() => page.props.storeInfo ?? {})

// Everything here is edited under Settings › Header & footer › Footer.
const settings = computed(() => page.props.layout?.footer ?? {})

// "{year}" in the copyright line, in Bangla digits.
const currentYear = String(new Date().getFullYear()).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
const copyright = computed(() => (settings.value.copyright || "{year}").replace("{year}", currentYear))

const columns = computed(() => settings.value.columns ?? [])
const legalLinks = computed(() => settings.value.legal_links ?? [])

const showContact = computed(() => settings.value.show_contact !== false)
const address = computed(() => settings.value.contact_address)
const email = computed(() => settings.value.contact_email)
const phone = computed(() => settings.value.contact_phone)

const socials = computed(() => [
  { name: "Facebook", url: siteInfo.value.facebook_url, icon: "/assets/chhondo/facebook.svg" },
  // The store settings have no LinkedIn column; the footer settings carry it.
  // Until a profile is saved, LinkedIn and YouTube open their main sites.
  { name: "LinkedIn", url: settings.value.linkedin_url || siteInfo.value.linkedin_url || "https://www.linkedin.com/", icon: "/assets/chhondo/linkedin.svg" },
  { name: "YouTube", url: siteInfo.value.youtube_url || "https://www.youtube.com/", icon: "/assets/chhondo/youtube.svg" },
  { name: "Instagram", url: siteInfo.value.instagram_url, icon: "/assets/chhondo/instagram.svg" },
])
</script>

<template>
  <footer class="chhondo-footer">
    <div class="chhondo-footer-pattern" aria-hidden="true" style="display: none"></div>
    <div class="container chhondo-footer-inner">
      <Link v-if="settings.show_logo !== false" href="/" class="chhondo-footer-logo" aria-label="Chhondo home">
        <img :src="'/assets/chhondo/logo-mark-light.svg'" alt="" class="chhondo-footer-logo-mark" />
        <img :src="'/assets/chhondo/logo-word-light.svg'" alt="Chhondo" class="chhondo-footer-logo-word" />
      </Link>

      <div class="chhondo-footer-main">
        <div class="chhondo-footer-about">
          <p v-if="settings.about_text" class="chhondo-footer-copy">{{ settings.about_text }}</p>

          <div v-if="showContact" class="chhondo-contact-list">
            <p v-if="settings.contact_title" class="chhondo-footer-column-title">{{ settings.contact_title }}</p>
            <div v-if="address" class="chhondo-contact-row">
              <img :src="'/assets/chhondo/location.svg'" alt="" />
              <span>{{ address }}</span>
            </div>
            <a v-if="email" class="chhondo-contact-row" :href="`mailto:${email}`">
              <img :src="'/assets/chhondo/email.svg'" alt="" />
              <span>{{ email }}</span>
            </a>
            <a v-if="phone" class="chhondo-contact-row" :href="`tel:${phone}`">
              <img :src="'/assets/chhondo/phone.svg'" alt="" />
              <span>{{ phone }}</span>
            </a>
          </div>
        </div>

        <div class="chhondo-footer-links">
          <div v-for="(column, index) in columns" :key="index" class="chhondo-footer-column">
            <p v-if="column.title" class="chhondo-footer-column-title">{{ column.title }}</p>
            <Link
              v-for="(link, linkIndex) in column.links ?? []"
              :key="linkIndex"
              :href="link.url || '#'"
              :target="link.target || '_self'"
            >{{ link.label }}</Link>
          </div>
        </div>
      </div>

      <div class="chhondo-footer-bottom">
        <div class="chhondo-legal">
          <span class="chhondo-legal-copy"><img :src="'/assets/chhondo/copyright.svg'" alt="" />{{ copyright }}</span>
          <template v-for="(link, i) in legalLinks" :key="i">
            <span class="chhondo-legal-separator"></span>
            <Link :href="link.url || '#'">{{ link.label }}</Link>
          </template>
        </div>

        <div v-if="socials.length" class="chhondo-socials">
          <template
            v-for="social in socials"
            :key="social.name"
          >
            <a
              v-if="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
            ><img :src="social.icon" alt="" /></a>
            <span v-else :aria-label="social.name">
              <img :src="social.icon" alt="" />
            </span>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.chhondo-footer {
  position: relative;
  overflow: hidden;
  background: #252f17;
  color: #e4e1e0;
  min-height: 576px;
  padding: 64px 0 80px;
}

.chhondo-footer-pattern {
  position: absolute;
  inset: 0;
  background-image: var(--chhondo-footer-pattern);
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 1920px 576px;
  pointer-events: none;
}

.chhondo-footer-inner { position: relative; z-index: 1; }

.chhondo-footer-logo {
  display: grid;
  grid-template-rows: 71px 12px;
  justify-items: center;
  width: 99px;
  height: 88px;
  overflow: hidden;
  margin-bottom: 32px;
}
.chhondo-footer-logo-mark { width: 82px; height: 71px; }
.chhondo-footer-logo-word { width: 99px; height: 12px; }

.chhondo-footer-main {
  display: flex;
  justify-content: space-between;
  gap: 72px;
}
.chhondo-footer-about { width: min(620px, 48%); }
.chhondo-footer-copy {
  max-width: 434px;
  margin: 0 0 32px;
  font: 300 16px/24px "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
}
.chhondo-contact-list { display: grid; gap: 28px; }
.chhondo-contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e4e1e0;
  font: 300 16px/24px "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  transition: color .2s ease;
}
.chhondo-contact-row:hover { color: #fff; }
.chhondo-contact-row img { width: 24px; height: 24px; flex: 0 0 24px; }

.chhondo-footer-links { display: flex; gap: 20px; padding-right: 95px; }
.chhondo-footer-column { display: flex; flex-direction: column; gap: 20px; width: 210px; }
.chhondo-footer-column-title { margin: 0; color: #fff; font-weight: 600; }
.chhondo-footer-column a {
  color: #e4e1e0;
  /* Labels come from the admin and may be English, so Latin sets in Poppins
     and Bangla falls through to Li Ador Noirrit. */
  font: 300 16px/24px "Poppins", "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  transition: color .2s ease;
}
.chhondo-footer-column a:hover { color: #cc9b25; }

.chhondo-footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid rgba(228,225,224,.24);
}
.chhondo-legal { display: flex; align-items: center; gap: 16px; font: 400 12px/20px "Li Ador Noirrit", "Hind Siliguri", sans-serif; }
.chhondo-legal-copy { display: inline-flex; align-items: center; gap: 4px; }
.chhondo-legal-copy img { width: 16px; height: 16px; display: block; }
.chhondo-legal a { color: inherit; }
.chhondo-legal a:hover { color: #cc9b25; }
.chhondo-legal-separator { width: 1px; height: 10px; background: #4c5441; }
.chhondo-socials { display: flex; align-items: center; gap: 24px; }
.chhondo-socials a,
.chhondo-socials span { display: block; transition: transform .2s ease, opacity .2s ease; }
.chhondo-socials a:hover { transform: translateY(-2px); opacity: .75; }
.chhondo-socials img { width: 24px; height: 24px; display: block; }

@media (max-width: 1023px) {
  .chhondo-footer { min-height: 0; padding: 52px 0 110px; }
  .chhondo-footer-main { flex-direction: column; gap: 48px; }
  .chhondo-footer-about { width: 100%; }
  .chhondo-footer-links { padding-right: 0; flex-wrap: wrap; }
}

/* Figma phone footer */
@media (max-width: 767px) {
  /* 40px of its own, plus 76px so the fixed bottom nav never covers the copyright. */
  .chhondo-footer { padding: 56px 0 116px; }
  .chhondo-footer-inner { padding-inline: 24px; }
  .chhondo-footer-logo { width: 78px; height: 68px; grid-template-rows: 55px 10px; margin-bottom: 32px; }
  .chhondo-footer-logo-mark { width: 65px; height: 55px; }
  .chhondo-footer-logo-word { width: 78px; height: 10px; }
  .chhondo-footer-main { gap: 32px; }
  .chhondo-footer-copy { max-width: none; font-size: 15px; line-height: 24px; }
  .chhondo-contact-list { gap: 16px; }
  .chhondo-contact-row { align-items: flex-start; font-size: 15px; line-height: 23px; }
  .chhondo-footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .chhondo-footer-column { width: auto; gap: 16px; }
  .chhondo-footer-column a { font-size: 15px; line-height: 23px; }
  .chhondo-footer-bottom {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 20px;
    margin-top: 32px;
    padding-top: 0;
    border-top: 0;
  }
  .chhondo-socials { gap: 16px; }
  .chhondo-legal { flex-wrap: wrap; gap: 4px 8px; color: rgba(228, 225, 224, .8); }
  .chhondo-legal-separator { display: none; }
}
</style>
