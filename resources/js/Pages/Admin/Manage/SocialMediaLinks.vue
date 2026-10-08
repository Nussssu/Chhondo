<template>
  <AdminLayout>
    <div class="page-content social-links-page">
      <PageHeader title="Store settings" />
      <SettingsTabs :tabs="STORE_TABS" />

      <div class="card mt-3">
        <div class="card-header">
          <h6 class="mb-0">Social links</h6>
        </div>
        <div class="card-body">
          <form :action="route('admin.manage.storeOrUpdate')" method="POST">
            <input type="hidden" name="_token" :value="csrfToken">
            <input v-if="siteInfo" type="hidden" name="_method" value="PUT">

            <div class="social-links-grid">
              <div v-for="profile in profiles" :key="profile.key" class="social-link-field">
                <label :for="profile.key" class="form-label">{{ profile.label }}</label>
                <input
                  type="url"
                  :id="profile.key"
                  :name="profile.key"
                  class="form-control"
                  :value="siteInfo?.[profile.key] ?? ''"
                  placeholder="https://"
                >
              </div>
            </div>

            <div class="social-links-actions">
              <button type="submit" class="btn btn-fig-primary btn-fig-md">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue'
import PageHeader from '@/components/Admin/PageHeader.vue'
import SettingsTabs from '@/components/Admin/SettingsTabs.vue'
import { STORE_TABS } from '@/settingsTabs'

defineProps({
  siteInfo: { type: Object, default: null },
})

const profiles = [
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'tiktok_url', label: 'TikTok URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'x_url', label: 'X (formerly Twitter) URL' },
]

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content
</script>

<style scoped>
.social-links-page { min-width: 0; }
.social-links-page .card { width: 100%; }
.social-links-page .card-header, .social-links-page .card-body { padding: 16px; }
.social-links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}
.social-link-field { min-width: 0; }
.social-link-field .form-control { width: 100%; min-width: 0; }
.social-links-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}
@media (max-width: 767px) {
  .social-links-grid { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .social-links-actions .btn { width: 100%; }
}
</style>
