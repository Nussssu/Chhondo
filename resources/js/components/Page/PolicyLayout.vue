<script setup>
import { rebrand } from "@/utils/rebrand"
/**
 * Figma "Refund and Returns Policy" layout, shared by every policy page:
 * a two-tone title, a line under it, numbered sections with bullet lists,
 * and the store's contact details.
 *
 * A page passes either `sections` (the Figma copy) or the body written in
 * Content › Pages (`blocks`, or the older baked `content`).
 */
import { computed } from "vue"
import { usePage } from "@inertiajs/vue3"

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  // [{ title, lines: [] }]
  sections: { type: Array, default: null },
  blocks: { type: Array, default: () => [] },
  content: { type: String, default: "" },
  showContact: { type: Boolean, default: false },
  contactDetails: { type: Object, default: null },
})

const contact = computed(() => usePage().props.contact ?? {})
const visibleContact = computed(() => props.contactDetails ?? contact.value)

// The closing word in gold, like every Figma section title.
const titleParts = computed(() => {
  const words = props.title.trim().split(/\s+/)
  return { lead: words.slice(0, -1).join(" "), accent: words.at(-1) }
})

/*
 * Policy bodies are written in the admin and still name the old brand. The
 * storefront speaks as Chhondo, so the name is swapped where it is shown —
 * never inside an e-mail address or a link.
 */

// Content › Pages widgets: headings start sections, text fills them.
const blockSections = computed(() => {
  const out = []
  for (const block of props.blocks ?? []) {
    if (block.type === "heading") {
      out.push({ title: block.text, html: "" })
    } else if (block.type === "text" && block.html) {
      if (!out.length) out.push({ title: "", html: "" })
      out[out.length - 1].html += rebrand(block.html)
    }
  }
  return out
})
</script>

<template>
  <section class="policy-page">
    <div class="policy-inner">
      <header class="policy-head">
        <h1 class="policy-title">
          {{ titleParts.lead ? `${titleParts.lead} ` : "" }}<span class="policy-accent">{{ titleParts.accent }}</span>
        </h1>
        <p v-if="subtitle" class="policy-sub">{{ subtitle }}</p>
      </header>

      <div class="policy-body">
        <!-- Figma copy -->
        <template v-if="sections">
          <div v-for="(section, i) in sections" :key="i" class="policy-section">
            <h2 class="policy-section-title">{{ section.title }}</h2>
            <ul class="policy-list">
              <li v-for="(line, n) in section.lines" :key="n">{{ line }}</li>
            </ul>
          </div>
        </template>

        <!-- Written in Content › Pages -->
        <template v-else-if="blockSections.length">
          <div v-for="(section, i) in blockSections" :key="i" class="policy-section">
            <h2 v-if="section.title" class="policy-section-title">{{ rebrand(section.title) }}</h2>
            <div class="policy-prose" v-html="section.html"></div>
          </div>
        </template>

        <div v-else-if="content" class="policy-prose" v-html="rebrand(content)"></div>

        <!-- Store contact details (Settings › Store) -->
        <div v-if="showContact && (visibleContact.address || visibleContact.email || visibleContact.phone)" class="policy-section">
          <h2 class="policy-section-title">{{ visibleContact.title || "যোগাযোগ:" }}</h2>
          <div class="policy-contact">
            <p v-if="visibleContact.address" class="policy-contact-row policy-contact-row--bangla">
              <img :src="visibleContact.locationIcon || '/assets/chhondo/location.svg'" alt="" :class="['policy-contact-icon', { 'policy-contact-icon--exact': visibleContact.locationIcon }]" />
              <span>{{ visibleContact.address }}</span>
            </p>
            <a v-if="visibleContact.email" :href="`mailto:${visibleContact.email}`" class="policy-contact-row policy-contact-row--latin">
              <img :src="visibleContact.emailIcon || '/assets/chhondo/email.svg'" alt="" :class="['policy-contact-icon', { 'policy-contact-icon--exact': visibleContact.emailIcon }]" />
              <span>{{ visibleContact.email }}</span>
            </a>
            <a v-if="visibleContact.phone" :href="`tel:${String(visibleContact.phone).replace(/[^\d+]/g, '')}`" class="policy-contact-row policy-contact-row--latin">
              <img :src="visibleContact.phoneIcon || '/assets/chhondo/phone.svg'" alt="" :class="['policy-contact-icon', { 'policy-contact-icon--exact': visibleContact.phoneIcon }]" />
              <span>{{ visibleContact.phone }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.policy-page { padding: 64px 20px 96px; background: #fff; }
.policy-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }

.policy-head { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
.policy-title {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 68px;
  color: #1a1817;
}
.policy-accent { color: #cc9b25; }
.policy-sub {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3c3834;
}

.policy-body { display: flex; flex-direction: column; gap: 24px; }
.policy-section { display: flex; flex-direction: column; gap: 16px; }
.policy-section-title {
  margin: 0;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: #3c3834;
}

.policy-list,
.policy-prose :deep(ul),
.policy-prose :deep(ol) {
  margin: 0;
  padding-left: 22px;
  list-style: disc;
}
.policy-prose :deep(ol) { list-style: decimal; }
.policy-list li,
.policy-prose,
.policy-prose :deep(p),
.policy-prose :deep(li) {
  font-family: "Li Ador Noirrit", "Hind Siliguri", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6d6560;
}
.policy-prose :deep(p) { margin: 0 0 8px; }
.policy-prose :deep(p:last-child) { margin-bottom: 0; }
.policy-prose :deep(a) { color: #252f17; text-decoration: underline; }
.policy-prose :deep(strong) { color: #3c3834; }
.policy-prose :deep(h2),
.policy-prose :deep(h3) {
  margin: 16px 0 8px;
  font-family: "Li Ador Noirrit", "Hind Siliguri", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: #3c3834;
}

.policy-contact { display: flex; flex-direction: column; gap: 16px; }
.policy-contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #6d6560;
}
.policy-contact-row--bangla { font-family: "Li Ador Noirrit", sans-serif; }
.policy-contact-row--latin { font-family: "Poppins", sans-serif; }
a.policy-contact-row:hover { color: #1a1817; }
.policy-contact-icon { width: 24px; height: 24px; flex-shrink: 0; filter: grayscale(1) brightness(.45); }
.policy-contact-icon--exact { filter: none; }

/* Refund (Figma 2466:9310): the header frame is a fixed 156px, and the intro
   is a 787px box with its own line break. */
.policy--refund .policy-head { min-height: 156px; justify-content: flex-start; }
.policy--refund .policy-sub { max-width: 787px; white-space: pre-line; }

@media (max-width: 767px) {
  .policy--refund .policy-head { min-height: 0; }
  .policy--refund .policy-sub { white-space: normal; }
  .policy-page { padding: 32px 20px 48px; }
  .policy-inner { gap: 32px; }
  .policy-title { font-size: 32px; line-height: 40px; }
  .policy-section-title { font-size: 18px; line-height: 26px; }
}
</style>
