<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="Logo, favicon, loader and footer image" />
      <SettingsTabs :tabs="STORE_TABS" />
      <div class="container mt-5">
        <div class="col-md-12">
          <div class="card shadow-sm border-0">
            <div class="card-header">
              <h5 class="card-title mb-0">Site Logo</h5>
            </div>

            <div class="card-body">
              <form :action="route('admin.media.store')" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="_token" :value="csrfToken">

                <div class="row">
                  <!-- Logo Section -->
                  <div class="col-md-6 mb-4">
                    <div class="border rounded p-3 bg-light">
                      <h6 class="mb-3">Site Logo <span class="text-muted fw-normal small">150px</span></h6>
                      <div class="media-preview mb-3 text-center position-relative">
                        <img :src="previewFor('logo')" alt="Logo" class="img-fluid">
                      </div>
                      <div class="form-group">
                        <input type="hidden" name="logo_library_path" :value="libraryPaths.logo ?? ''">
                        <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('logo')">
                          {{ previewFor('logo') ? 'Change logo' : 'Choose from Media Library' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Favicon Section -->
                  <div class="col-md-6 mb-4">
                    <div class="border rounded p-3 bg-light">
                      <h6 class="mb-3">Favicon <span class="text-muted fw-normal small">25 × 25px</span></h6>
                      <div class="media-preview mb-3 text-center position-relative">
                        <img :src="previewFor('favicon')" alt="Favicon" class="img-fluid" style="max-width: 50px;">
                      </div>
                      <div class="form-group">
                        <input type="hidden" name="favicon_library_path" :value="libraryPaths.favicon ?? ''">
                        <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('favicon')">
                          {{ previewFor('favicon') ? 'Change favicon' : 'Choose from Media Library' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <!-- Loader Section -->
                  <div class="col-md-6 mb-4">
                    <div class="border rounded p-3 bg-light">
                      <h6 class="mb-3">Loading Spinner <span class="text-muted fw-normal small">150 × 150px</span></h6>
                      <div class="media-preview mb-3 text-center position-relative">
                        <img :src="previewFor('loader')" alt="Loader" class="img-fluid">
                      </div>
                      <div class="form-group">
                        <input type="hidden" name="loader_library_path" :value="libraryPaths.loader ?? ''">
                        <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('loader')">
                          {{ previewFor('loader') ? 'Change spinner' : 'Choose from Media Library' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Footer Image Section -->
                  <div class="col-md-6 mb-4">
                    <div class="border rounded p-3 bg-light">
                      <h6 class="mb-3">Footer Image <span class="text-muted fw-normal small">150px</span></h6>
                      <div class="media-preview mb-3 text-center position-relative">
                        <img :src="previewFor('footer_image')" alt="Footer Image" class="img-fluid">
                      </div>
                      <div class="form-group">
                        <input type="hidden" name="footer_image_library_path" :value="libraryPaths.footer_image ?? ''">
                        <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="openPicker('footer_image')">
                          {{ previewFor('footer_image') ? 'Change footer image' : 'Choose from Media Library' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="text-center">
                  <button type="submit" class="btn btn-fig-primary btn-fig-md">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MediaLibraryPickerModal v-if="pickerField" @close="pickerField = null" @select="onLibrarySelected" />
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { STORE_TABS } from '@/settingsTabs'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'

const props = defineProps({
  media: {
    type: Object,
    default: null
  }
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

// Per-field: a data URL for a freshly chosen file, or the picked library path.
const previews = reactive({})
const libraryPaths = reactive({})
const pickerField = ref(null)

const previewFor = (field) => previews[field] ?? props.media?.[field] ?? null

const openPicker = (field) => {
  pickerField.value = field
}

const onLibrarySelected = (item) => {
  const field = pickerField.value
  if (!field) return

  libraryPaths[field] = item.url
  previews[field] = item.url

  pickerField.value = null
}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
