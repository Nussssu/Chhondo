<template>
  <Teleport to="body">
    <div class="reply-backdrop" @click.self="close">
      <form class="reply-modal" @submit.prevent="submit">
        <div class="reply-head">
          <div>
            <h6>Reply to review</h6>
            <p>{{ review?.name }} · {{ review?.product_name }}</p>
          </div>
          <button type="button" class="reply-close" aria-label="Close" @click="close"><X :size="18" /></button>
        </div>

        <div class="reply-body">
          <div class="original-review">{{ review?.review }}</div>
          <label for="admin-review-reply">Admin reply</label>
          <textarea
            id="admin-review-reply"
            v-model="form.admin_reply"
            rows="5"
            maxlength="2000"
            placeholder="Write a helpful public-facing response…"
          ></textarea>
          <div v-if="form.errors.admin_reply" class="reply-error">{{ form.errors.admin_reply }}</div>
        </div>

        <div class="reply-foot">
          <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="close">Cancel</button>
          <button type="submit" class="btn btn-fig-primary btn-fig-sm" :disabled="form.processing">
            <MessageSquareReply :size="15" /> Save reply
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { MessageSquareReply, X } from 'lucide-vue-next'

const props = defineProps({ review: { type: Object, required: true } })
const emit = defineEmits(['close'])

const form = useForm({ admin_reply: props.review.admin_reply ?? '' })

watch(() => props.review.id, () => {
  form.admin_reply = props.review.admin_reply ?? ''
  form.clearErrors()
})

onMounted(() => { document.body.style.overflow = 'hidden' })
onBeforeUnmount(() => { document.body.style.overflow = '' })

function close() {
  if (!form.processing) emit('close')
}

function submit() {
  form.patch(route('admin.product-reviews.reply', props.review.id), {
    preserveScroll: true,
    onSuccess: close,
  })
}
</script>

<style scoped>
.reply-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1060;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, .48);
}
.reply-modal {
  width: min(520px, 100%);
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: 0 24px 64px rgba(15, 23, 42, .24);
}
.reply-head,
.reply-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; }
.reply-head { border-bottom: 1px solid var(--line); }
.reply-head h6 { margin: 0 0 2px; font-size: 16px; color: var(--text); }
.reply-head p { margin: 0; font-size: 12px; color: var(--text-muted); }
.reply-close { width: 30px; height: 30px; display: grid; place-items: center; border: 0; border-radius: var(--r-sm); background: none; color: var(--text-muted); }
.reply-close:hover { background: var(--surface-sunk); color: var(--text); }
.reply-body { display: grid; gap: 10px; padding: 18px; }
.original-review { padding: 10px 12px; border-left: 3px solid var(--admin-green-500); background: var(--surface-sunk); color: var(--text-muted); font-size: 12px; line-height: 1.5; }
.reply-body label { font-size: 12px; font-weight: 700; color: var(--text); }
.reply-body textarea { width: 100%; resize: vertical; padding: 10px 12px; border: 1px solid var(--line-strong); border-radius: var(--r-sm); background: var(--surface); color: var(--text); font: inherit; font-size: 13px; }
.reply-body textarea:focus { outline: 0; border-color: var(--admin-green-600); box-shadow: 0 0 0 3px rgba(37, 47, 23, .12); }
.reply-error { font-size: 12px; color: var(--st-danger); }
.reply-foot { justify-content: flex-end; border-top: 1px solid var(--line); background: var(--surface-alt); }
.reply-foot .btn { display: inline-flex; align-items: center; gap: 5px; }
</style>
