<template>
  <div class="pos-user-search">
    <input
      type="text"
      class="form-control"
      v-model="query"
      placeholder="Search user by name or phone..."
      @input="onInput"
      @focus="showResults = true"
    >
    <ul v-if="showResults && results.length" class="pos-user-results">
      <li v-for="user in results" :key="user.id" @mousedown.prevent="select(user)">
        {{ user.name }} ({{ user.phone }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['select'])

const query = ref('')
const results = ref([])
const showResults = ref(false)
let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) { results.value = []; return }
  debounceTimer = setTimeout(() => {
    axios.get(route('admin.pos.user.search'), { params: { q: query.value } })
      .then((res) => { results.value = res.data; showResults.value = true })
  }, 300)
}

function select(user) {
  query.value = `${user.name} (${user.phone})`
  showResults.value = false
  emit('select', user)
}
</script>

<style scoped>
.pos-user-search {
  position: relative;
  flex: 1;
}
.pos-user-results {
  position: absolute;
  z-index: 20;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  max-height: 220px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding: 4px 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.pos-user-results li {
  padding: 6px 12px;
  cursor: pointer;
}
.pos-user-results li:hover {
  background: #f5f5f5;
}
</style>
