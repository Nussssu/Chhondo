<template>
  <AdminLayout>
    <div class="page-content">
      <div class="">
        <div class="main-body">
          <div class="row">

            <div class="col-lg-3">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex flex-column align-items-center text-center">
                    <img
                      :src="preview || profileImageSrc"
                      alt="Admin"
                      class="rounded-circle p-1 bg-primary"
                      width="200"
                    >
                    <div class="mt-3">
                      <h4>Personal Info</h4>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 class="mb-0">Full Name</h6>
                      <span class="text-secondary">{{ props.userInfo.name }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 class="mb-0">Email</h6>
                      <span class="text-secondary">{{ props.userInfo.email }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 class="mb-0">Phone Number</h6>
                      <span class="text-secondary">{{ props.userInfo.addresses?.[0]?.phone ?? 'N/A' }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 class="mb-0">City</h6>
                      <span class="text-secondary">{{ props.userInfo.addresses?.[0]?.city ?? 'N/A' }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 class="mb-0">Address</h6>
                      <span class="text-secondary">{{ props.userInfo.addresses?.[0]?.address ?? 'N/A' }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-lg-6">
              <div class="card">
                <div class="card-body">
                  <ul class="nav nav-tabs nav-primary" role="tablist">
                    <li class="nav-item" role="presentation">
                      <a class="nav-link active" data-bs-toggle="tab" href="#primaryhome" role="tab" aria-selected="true">
                        <div class="d-flex align-items-center">
                          <div class="tab-icon"><i class="admin-icon font-18 me-1" data-lucide="home"></i></div>
                          <div class="tab-title">Home</div>
                        </div>
                      </a>
                    </li>
                    <li class="nav-item" role="presentation">
                      <a class="nav-link" data-bs-toggle="tab" href="#primaryprofile" role="tab" aria-selected="false" tabindex="-1">
                        <div class="d-flex align-items-center">
                          <div class="tab-icon"><i class="admin-icon font-18 me-1" data-lucide="user"></i></div>
                          <div class="tab-title">Profile</div>
                        </div>
                      </a>
                    </li>
                  </ul>

                  <div class="tab-content py-3">
                    <!-- Profile Update Tab -->
                    <div class="tab-pane fade active show" id="primaryhome" role="tabpanel">
                      <form class="row g-3" method="post" :action="route('profileUpdate')" enctype="multipart/form-data">
                        <input type="hidden" name="_token" :value="csrfToken">

                        <div class="col-md-12">
                          <label for="profileImageInput" class="form-label">Profile Image</label>
                          <input type="hidden" name="image_library_path" :value="imageLibraryPath ?? ''">
                          <button type="button" class="btn btn-outline-secondary btn-fig-sm d-block" @click="showPicker = true">
                            <i class="admin-icon" data-lucide="image"></i>
                            {{ preview ? 'Change image' : 'Choose from Media Library' }}
                          </button>
                          <div v-if="errors.image" class="text-danger">{{ errors.image }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="fullname" class="form-label">Full Name</label>
                          <div class="position-relative input-icon">
                            <input type="text" class="form-control" name="name" id="fullname" :value="props.userInfo.name">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="user"></i></span>
                          </div>
                          <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="email" class="form-label">Email</label>
                          <div class="position-relative input-icon">
                            <input type="email" class="form-control" name="email" id="email" :value="props.userInfo.email">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="mail"></i></span>
                          </div>
                          <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="phone" class="form-label">Phone</label>
                          <div class="position-relative input-icon">
                            <input type="text" class="form-control" name="phone" id="phone" :value="props.userInfo.addresses?.[0]?.phone ?? ''">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="phone"></i></span>
                          </div>
                          <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="city" class="form-label">City</label>
                          <div class="position-relative input-icon">
                            <input type="text" name="city" id="city" class="form-control" :value="props.userInfo.addresses?.[0]?.city ?? ''">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="building-2"></i></span>
                          </div>
                          <div v-if="errors.city" class="text-danger">{{ errors.city }}</div>
                        </div>

                        <div class="col-md-12">
                          <label for="address" class="form-label">Address</label>
                          <textarea class="form-control" id="address" name="address" placeholder="Address ..." rows="3">{{ props.userInfo.addresses?.[0]?.address ?? '' }}</textarea>
                          <div v-if="errors.address" class="text-danger">{{ errors.address }}</div>
                        </div>

                        <div class="col-md-12 mt-3">
                          <div class="d-md-flex d-grid align-items-center gap-3">
                            <button type="submit" class="btn btn-fig-primary btn-fig-md w-100">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="check-circle" viewBox="0 0 16 16">
                                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                              </svg>
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <!-- Password Update Tab -->
                    <div class="tab-pane fade" id="primaryprofile" role="tabpanel">
                      <form class="row g-3" method="post" :action="route('passwordUpdate')">
                        <input type="hidden" name="_token" :value="csrfToken">

                        <div class="col-md-12">
                          <label for="current_password" class="form-label">Current Password</label>
                          <div class="position-relative input-icon">
                            <input type="password" class="form-control" name="current_password" id="current_password">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="lock"></i></span>
                          </div>
                          <div v-if="errors.current_password" class="text-danger">{{ errors.current_password }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="new_password" class="form-label">New Password</label>
                          <div class="position-relative input-icon">
                            <input type="password" class="form-control" name="new_password" id="new_password">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="lock"></i></span>
                          </div>
                          <div v-if="errors.new_password" class="text-danger">{{ errors.new_password }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="confirm_password" class="form-label">Confirm Password</label>
                          <div class="position-relative input-icon">
                            <input type="password" class="form-control" name="new_password_confirmation" id="confirm_password">
                            <span class="position-absolute top-50 translate-middle-y"><i class="admin-icon" data-lucide="lock"></i></span>
                          </div>
                          <div v-if="errors.new_password_confirmation" class="text-danger">{{ errors.new_password_confirmation }}</div>
                        </div>

                        <div class="col-md-12 mt-3">
                          <div class="d-md-flex d-grid align-items-center gap-3">
                            <button type="submit" class="btn btn-fig-primary btn-fig-md w-100">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="admin-icon" data-lucide="check-circle" viewBox="0 0 16 16">
                                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                              </svg>
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <MediaLibraryPickerModal v-if="showPicker" @close="showPicker = false" @select="onLibrarySelected" />
  </AdminLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import MediaLibraryPickerModal from '@/components/Admin/MediaLibraryPickerModal.vue'
import { useStickyBootstrapTabs } from '@/composables/useStickyTab'

const props = defineProps({
  userInfo: Object,
})

const csrfToken = document.querySelector('meta[name=csrf-token]')?.content
const errors = usePage().props.errors ?? {}

const showPicker = ref(false)
const preview = ref(null)
const imageLibraryPath = ref(null)

const profileImageSrc = computed(() => {
  const image = props.userInfo?.image
  // Stored values are either a full asset URL or a path relative to public/.
  if (image) return /^(https?:)?\/\//.test(image) ? image : '/' + image.replace(/^\/+/, '')
  const name = encodeURIComponent(props.userInfo?.name ?? 'User')
  return `https://ui-avatars.com/api/?name=${name}`
})

const onLibrarySelected = (item) => {
  imageLibraryPath.value = item.url
  preview.value = item.url
  showPicker.value = false
}

let releaseTabs = () => {}

onMounted(() => {
  if (typeof window.lucide !== 'undefined') window.lucide.createIcons()

  // Saving posts natively and reloads, which would otherwise always land on
  // the first tab regardless of which form was submitted.
  releaseTabs = useStickyBootstrapTabs()
})

onBeforeUnmount(() => releaseTabs())
</script>
