<script setup>
/**
 * Renders its content in the browser only, once the page has mounted.
 *
 * For <Teleport to="body">. Vue hydrates a teleport by reading <body> from its
 * first child, but this storefront's <body> starts with the page data, #app and
 * any marketing snippets — so server-rendered teleport markup can never line up
 * and every page would report a hydration mismatch. The storefront's teleports
 * (toaster, login prompt, lightbox, search) are all closed or empty when a page
 * loads, so rendering them a moment later in the browser changes nothing a
 * visitor can see. Wrap any new <Teleport to="body"> in this too.
 */
import { onMounted, ref } from 'vue'

const mounted = ref(false)

onMounted(() => {
    mounted.value = true
})
</script>

<template>
    <slot v-if="mounted" />
</template>
