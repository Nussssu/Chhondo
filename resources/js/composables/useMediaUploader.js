import { ref } from 'vue'
import axios from 'axios'

/**
 * Bulk upload to the media library, with per-file progress.
 *
 * Files go up in small concurrent batches rather than one giant request: a
 * drag-and-drop of thirty photos would otherwise be a single multi-hundred-MB
 * POST that dies on PHP's post_max_size and reports nothing until it fails.
 * The endpoint validates each file on its own, so one rejected file never
 * discards the rest of the batch.
 */
const BATCH_SIZE = 4

export function useMediaUploader() {
  // One entry per file: { id, name, size, status, progress, message }
  const queue = ref([])
  const uploading = ref(false)

  let nextId = 0

  const reset = () => {
    queue.value = []
  }

  const clearFinished = () => {
    queue.value = queue.value.filter((entry) => entry.status === 'uploading' || entry.status === 'queued')
  }

  /**
   * @param {File[]} files
   * @param {(items: object[]) => void} onUploaded called per batch, so the grid fills in as it goes
   * @returns {Promise<{uploaded: object[], failed: number}>}
   */
  const upload = async (files, onUploaded) => {
    const list = Array.from(files || [])
    if (!list.length) return { uploaded: [], failed: 0 }

    const entries = list.map((file) => ({
      id: `u${nextId++}`,
      name: file.name,
      size: file.size,
      status: 'queued',
      progress: 0,
      message: null,
      file,
    }))

    queue.value = [...queue.value, ...entries]
    uploading.value = true

    const uploaded = []
    let failed = 0

    try {
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE)
        const formData = new FormData()
        batch.forEach((entry) => {
          entry.status = 'uploading'
          formData.append('files[]', entry.file)
        })

        try {
          const { data } = await axios.post(route('admin.media-library.upload'), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (event) => {
              if (!event.total) return
              const percent = Math.round((event.loaded / event.total) * 100)
              batch.forEach((entry) => { entry.progress = percent })
            },
          })

          // The server reports failures by original filename.
          const failures = new Map((data.errors || []).map((e) => [e.name, e.message]))

          batch.forEach((entry) => {
            const message = failures.get(entry.name)
            if (message) {
              entry.status = 'failed'
              entry.message = message
              failed++
            } else {
              entry.status = 'done'
              entry.progress = 100
            }
          })

          if (data.items?.length) {
            uploaded.push(...data.items)
            onUploaded?.(data.items)
          }
        } catch (error) {
          const message = error.response?.status === 413
            ? 'Too large for the server to accept.'
            : error.response?.data?.message || 'Upload failed.'

          batch.forEach((entry) => {
            entry.status = 'failed'
            entry.message = message
            failed++
          })
        } finally {
          // Release the File handles once the batch is done with them.
          batch.forEach((entry) => { entry.file = null })
        }
      }
    } finally {
      uploading.value = false
    }

    return { uploaded, failed }
  }

  return { queue, uploading, upload, reset, clearFinished }
}

/**
 * Drag-and-drop wiring for a drop target.
 *
 * Tracks enter/leave with a depth counter — dragging over a child element fires
 * dragleave on the parent, which would otherwise make the overlay flicker.
 */
export function useDropZone(onDrop) {
  const isDragging = ref(false)
  let depth = 0

  const hasFiles = (event) =>
    Array.from(event.dataTransfer?.types || []).includes('Files')

  const onDragEnter = (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    depth++
    isDragging.value = true
  }

  const onDragOver = (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const onDragLeave = (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    depth = Math.max(0, depth - 1)
    if (depth === 0) isDragging.value = false
  }

  const onDropFiles = (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    depth = 0
    isDragging.value = false

    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length) onDrop(files)
  }

  return {
    isDragging,
    dropHandlers: {
      onDragenter: onDragEnter,
      onDragover: onDragOver,
      onDragleave: onDragLeave,
      onDrop: onDropFiles,
    },
  }
}
