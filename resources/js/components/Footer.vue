<script setup>
import { computed } from "vue"
import { Link, usePage } from "@inertiajs/vue3"
import { ShieldCheck, Headphones, Truck } from 'lucide-vue-next'

const page = usePage()
const siteInfo = computed(() => page.props.storeInfo ?? {})

// Everything here is edited under Settings › Header & footer › Footer.
const settings = computed(() => page.props.layout?.footer ?? {})

// "{year}" in the copyright line, in Bangla digits.
const currentYear = String(new Date().getFullYear()).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
const copyright = computed(() => (settings.value.copyright || "{year}").replace("{year}", currentYear))

const columns = computed(() => (settings.value.columns ?? []).filter(column => column.enabled !== false).map(column => ({ ...column, links: (column.links ?? []).filter(link => link.enabled !== false) })))
const legalLinks = computed(() => (settings.value.legal_links ?? []).filter(link => link.enabled !== false))
const badges = computed(() => (settings.value.badges ?? []).filter(badge => badge.enabled !== false))

const showContact = computed(() => settings.value.show_contact !== false)
const address = computed(() => settings.value.contact_address)
const email = computed(() => settings.value.contact_email)
const phone = computed(() => settings.value.contact_phone)
const badgeIcons = { security: ShieldCheck, support: Headphones, delivery: Truck }

const socials = computed(() => settings.value.socials_enabled === false ? [] : [
  { name: "Facebook", url: siteInfo.value.facebook_url, active: siteInfo.value.facebook_active, icon: "/assets/chhondo/facebook.svg" },
  { name: "TikTok", url: siteInfo.value.tiktok_url, active: siteInfo.value.tiktok_active, icon: "/assets/chhondo/tiktok.svg" },
  { name: "YouTube", url: siteInfo.value.youtube_url, active: siteInfo.value.youtube_active, icon: "/assets/chhondo/youtube.svg" },
  { name: "Instagram", url: siteInfo.value.instagram_url, active: siteInfo.value.instagram_active, icon: "/assets/chhondo/instagram.svg" },
  { name: "X", url: siteInfo.value.x_url, active: siteInfo.value.x_active, icon: "/assets/chhondo/x.svg" },
  // LinkedIn lives in the footer settings (Settings › Header & footer ›
  // Footer › Social profiles); the rest come from Settings › Social links.
  // Only profiles that are saved and switched on render, so the footer
  // mirrors exactly what the admin chose.
  { name: "LinkedIn", url: settings.value.linkedin_url, active: settings.value.linkedin_active, icon: "/assets/chhondo/linkedin.svg" },
].filter((social) => social.url && social.active !== false))
</script>

<template>
  <footer v-if="settings.enabled !== false" class="chhondo-footer">
    <div class="chhondo-footer-pattern" aria-hidden="true"></div>
    <div class="container chhondo-footer-inner">
      <Link v-if="settings.about_enabled !== false && settings.show_logo !== false" href="/" class="chhondo-footer-logo" aria-label="Chhondo home">
        <img :src="'/assets/chhondo/logo-mark-light.svg'" alt="" class="chhondo-footer-logo-mark" />
        <img :src="'/assets/chhondo/logo-word-light.svg'" alt="Chhondo" class="chhondo-footer-logo-word" />
      </Link>

      <div class="chhondo-footer-main">
        <div class="chhondo-footer-about">
          <p v-if="settings.about_enabled !== false && settings.about_text" class="chhondo-footer-copy">{{ settings.about_text }}</p>

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

        <div v-if="settings.columns_enabled !== false && columns.length" class="chhondo-footer-links">
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

      <div v-if="settings.show_badges && badges.length" class="chhondo-footer-badges">
        <div v-for="(badge, index) in badges" :key="index" class="chhondo-footer-badge">
          <component :is="badgeIcons[badge.icon] || ShieldCheck" :size="24" aria-hidden="true" />
          <div><strong v-if="badge.title">{{ badge.title }}</strong><span v-if="badge.text">{{ badge.text }}</span></div>
        </div>
      </div>

      <div v-if="settings.bottom_bar_enabled !== false || socials.length" class="chhondo-footer-bottom" :class="{ 'is-social-only': settings.bottom_bar_enabled === false }">
        <div v-if="settings.bottom_bar_enabled !== false" class="chhondo-legal">
          <span class="chhondo-legal-copy"><img :src="'/assets/chhondo/copyright.svg'" alt="" />{{ copyright }}</span>
          <template v-for="(link, i) in legalLinks" :key="i">
            <span class="chhondo-legal-separator"></span>
            <Link :href="link.url || '#'">{{ link.label }}</Link>
          </template>
        </div>

        <div v-if="socials.length" class="chhondo-socials">
          <span v-if="settings.about_enabled !== false && settings.follow_label" class="chhondo-follow-label">{{ settings.follow_label }}</span>
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
          ><img :src="social.icon" alt="" /></a>
        </div>
      </div>
      <p v-if="settings.bottom_bar_enabled !== false && siteInfo.footer_text" class="chhondo-footer-note">{{ siteInfo.footer_text }}</p>
    </div>
  </footer>
</template>

<style scoped>
.chhondo-footer-badges { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
.chhondo-footer-badge { display: flex; align-items: center; gap: 12px; min-width: 0; }
.chhondo-footer-badge > svg { flex-shrink: 0; color: #cc9b25; }
.chhondo-footer-badge div { display: grid; gap: 4px; }
.chhondo-footer-badge strong { font-size: 14px; font-weight: 500; }
.chhondo-footer-badge span, .chhondo-follow-label { font: 300 12px/20px "Poppins", "Li Ador Noirrit", sans-serif; }
.chhondo-socials { flex-wrap: wrap; }
.chhondo-footer-bottom.is-social-only { justify-content: flex-end; }
.chhondo-footer-note { margin: 16px 0 0; white-space: pre-line; font: 300 12px/20px "Poppins", "Li Ador Noirrit", sans-serif; }
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
  background-image: url('/assets/chhondo/footer-pattern.png');
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 1920px 576px;
  pointer-events: none;
}

.chhondo-footer-inner { position: relative; z-index: 1; width: min(1360px, calc(100% - 48px)); max-width: 1360px; padding-inline: 0; margin-inline: auto; }

.chhondo-footer-logo {
  position: relative;
  display: block;
  width: 99px;
  height: 88px;
  overflow: hidden;
  margin-bottom: 32px;
}
.chhondo-footer-logo-mark { position: absolute; top: 0; left: 8.49%; }
.chhondo-footer-logo-word { position: absolute; top: 86.19%; left: 0; }

.chhondo-footer-main {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}
.chhondo-footer-about { width: 620px; max-width: 48%; flex-shrink: 1; }
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
.chhondo-contact-row:first-child:not(a) { font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif; }

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
  border-top: 1px solid #4c5441;
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
  .chhondo-footer-about { width: 100%; max-width: none; }
  .chhondo-footer-links { padding-right: 0; flex-wrap: wrap; }
}

/* Figma phone footer */
@media (max-width: 767px) {
  /* 40px of its own, plus 76px so the fixed bottom nav never covers the copyright. */
  .chhondo-footer { padding: 56px 0 116px; }
  .chhondo-footer-inner { width: calc(100% - 48px); padding-inline: 0; }
  .chhondo-footer-logo { margin-bottom: 32px; }
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
