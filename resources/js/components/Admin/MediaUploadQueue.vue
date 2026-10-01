<template>
  <div v-if="queue.length" class="mq">
    <div class="mq-head">
      <span class="mq-title">
        {{ summary }}
      </span>
      <button v-if="!uploading" type="button" class="mq-dismiss" @click="$emit('clear')">Dismiss</button>
    </div>

    <ul class="mq-list">
      <li v-for="entry in queue" :key="entry.id" class="mq-row" :class="`is-${entry.status}`">
        <span class="mq-name" :title="entry.name">{{ entry.name }}</span>

        <span v-if="entry.status === 'failed'" class="mq-error">{{ entry.message }}</span>
        <span v-else-if="entry.status === 'done'" class="mq-ok">Uploaded</span>
        <span v-else class="mq-bar">
          <span class="mq-bar-fill" :style="{ width: entry.progress + '%' }"></span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  queue: { type: Array, default: () => [] },
  uploading: { type: Boolean, default: false },
})

defineEmits(['clear'])

const summary = computed(() => {
  const done = props.queue.filter((e) => e.status === 'done').length
  const failed = props.queue.filter((e) => e.status === 'failed').length
  const total = props.queue.length

  if (props.uploading) return `Uploading ${done + failed} of ${total}...`
  if (failed) return `${done} uploaded, ${failed} failed`
  return `${done} uploaded`
})
</script>

<style scoped>
.mq {
  border: 1px solid #e3e6ea;
  border-radius: 10px;
  background: #fff;
  margin-bottom: 14px;
  overflow: hidden;
}
.mq-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f6f8fa;
  border-bottom: 1px solid #e3e6ea;
}
.mq-title { font-size: 13px; font-weight: 600; color: #37474f; }
.mq-dismiss {
  border: 0; background: transparent; color: #6c757d;
  font-size: 12px; cursor: pointer; padding: 0;
}
.mq-dismiss:hover { color: #37474f; text-decoration: underline; }
.mq-list { list-style: none; margin: 0; padding: 0; max-height: 190px; overflow-y: auto; }
.mq-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 12px;
  align-items: center;
  padding: 7px 12px;
  font-size: 12px;
  border-bottom: 1px solid #f1f3f5;
}
.mq-row:last-child { border-bottom: 0; }
.mq-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #37474f; }
.mq-bar { height: 5px; border-radius: 999px; background: #e9ecef; overflow: hidden; }
.mq-bar-fill { display: block; height: 100%; background: #356019; transition: width .2s ease; }
.mq-ok { color: #2C5015; font-weight: 600; }
.mq-error { color: #C0392B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mq-row.is-failed .mq-name { color: #C0392B; }
</style>
