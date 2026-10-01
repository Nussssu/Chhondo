<script setup>
import BlogForm from './Partials/BlogForm.vue'

defineProps({
  blog_category: { type: Array, default: () => [] },
})
</script>

<template>
  <BlogForm :categories="blog_category" />
</template>
