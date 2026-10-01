<template>
  <AdminLayout>
    <div class="page-content">
      <PageHeader title="Store settings" subtitle="Social profiles linked from the storefront footer" />
      <SettingsTabs :tabs="STORE_TABS" />
      <div class="card mt-3 col-md-6">
        <div class="card-header">
          <h5 class="mb-3">{{ siteInfo ? 'Edit Site' : 'Create Site' }}</h5>
          <p class="mb-4">
            {{ siteInfo ? "Update your site's basic information." : "Create your site's basic information." }}
          </p>
        </div>

        <div class="card-body">
          <form :action="route('admin.manage.storeOrUpdate')" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="_token" :value="csrfToken">
            <input v-if="siteInfo" type="hidden" name="_method" value="PUT">

            <!-- Facebook URL -->
            <div class="col-md-6 mb-3">
              <label for="facebook_url" class="form-label">Facebook URL</label>
              <input type="url" id="facebook_url" name="facebook_url" class="form-control"
                :value="siteInfo?.facebook_url ?? ''">
            </div>

            <!-- TikTok URL -->
            <div class="col-md-6 mb-3">
              <label for="tiktok_url" class="form-label">TikTok URL</label>
              <input type="url" id="tiktok_url" name="tiktok_url" class="form-control"
                :value="siteInfo?.tiktok_url ?? ''">
            </div>

            <!-- YouTube URL -->
            <div class="col-md-6 mb-3">
              <label for="youtube_url" class="form-label">YouTube URL</label>
              <input type="url" id="youtube_url" name="youtube_url" class="form-control"
                :value="siteInfo?.youtube_url ?? ''">
            </div>

            <!-- Instagram URL -->
            <div class="col-md-6 mb-3">
              <label for="instagram_url" class="form-label">Instagram URL</label>
              <input type="url" id="instagram_url" name="instagram_url" class="form-control"
                :value="siteInfo?.instagram_url ?? ''">
            </div>

            <!-- X (formerly Twitter) URL -->
            <div class="col-md-6 mb-3">
              <label for="x_url" class="form-label">X (formerly Twitter) URL</label>
              <input type="url" id="x_url" name="x_url" class="form-control"
                :value="siteInfo?.x_url ?? ''">
            </div>

            <div class="mb-3">
              <button type="submit" class="btn btn-fig-primary btn-fig-md">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { STORE_TABS } from '@/settingsTabs'

const props = defineProps({
  siteInfo: {
    type: Object,
    default: null
  }
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
})
</script>
