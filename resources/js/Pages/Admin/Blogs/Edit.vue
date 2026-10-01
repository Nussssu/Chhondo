<script setup>
import BlogForm from './Partials/BlogForm.vue'

defineProps({
  blogs: { type: Object, required: true },
  blog_category: { type: Array, default: () => [] },
})
</script>

<template>
  <BlogForm :blog="blogs" :categories="blog_category" />
</template>
