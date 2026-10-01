<template>
  <FormModal title="Manage Comment" @close="$emit('close')">
    <div class="mb-3">
      <label class="form-label">Add New Comment</label>
      <div class="d-flex gap-2">
        <input type="text" v-model="newCommentText" class="form-control" placeholder="Enter comment name">
        <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="addingComment" @click="addComment">Add</button>
      </div>
    </div>
    <hr>
    <div class="mb-2">
      <label class="form-label">Select Existing Comment</label>
      <select v-model="selectedCommentId" class="form-select">
        <option disabled value="">Select or change a comment</option>
        <option v-for="comment in commentsList" :key="comment.id" :value="comment.id">{{ comment.name }}</option>
      </select>
    </div>

    <template #footer>
      <button type="button" class="btn btn-fig-secondary btn-fig-sm" @click="$emit('close')">Close</button>
      <button type="button" class="btn btn-fig-primary btn-fig-sm" :disabled="!selectedCommentId || associatingComment" @click="associateComment">Save</button>
    </template>
  </FormModal>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import FormModal from '@/components/Admin/FormModal.vue'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, required: true },
  comments: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'saved', 'comments-updated'])

const commentsList = ref([...props.comments])
const newCommentText = ref('')
const selectedCommentId = ref(props.order.comment?.id ?? '')
const addingComment = ref(false)
const associatingComment = ref(false)

async function addComment() {
  if (!newCommentText.value.trim()) return
  addingComment.value = true
  try {
    const res = await axios.post(route('admin.orders.ordercommentadd'), {
      order_id: props.order.id,
      name: newCommentText.value,
    })
    commentsList.value = res.data.data
    emit('comments-updated', commentsList.value)
    const created = commentsList.value.find((c) => c.name === newCommentText.value)
    if (created) selectedCommentId.value = created.id
    newCommentText.value = ''
    toast('success', 'Comment added')
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Failed to add comment')
  } finally {
    addingComment.value = false
  }
}

async function associateComment() {
  if (!selectedCommentId.value) return
  associatingComment.value = true
  try {
    await axios.post(route('admin.orders.orderComment'), {
      order_id: props.order.id,
      comment_id: selectedCommentId.value,
    })
    const found = commentsList.value.find((c) => c.id === selectedCommentId.value)
    toast('success', 'Comment updated')
    emit('saved', found ?? null)
    emit('close')
  } catch (e) {
    toast('error', e.response?.data?.message ?? 'Failed to update comment')
  } finally {
    associatingComment.value = false
  }
}
</script>
