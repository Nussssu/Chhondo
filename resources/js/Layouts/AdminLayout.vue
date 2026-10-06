<template>
  <div class="wrapper">

    <!-- ── Sidebar ──────────────────────────────────────── -->
    <div class="sidebar-wrapper" data-simplebar="true">
      <Sidebar :logo="adminLogo" :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    </div>
    <!-- ── /Sidebar ── -->

    <!-- ── Topbar ─────────────────────────────────────── -->
    <header>
      <div class="topbar d-flex align-items-center">
        <nav class="navbar navbar-expand gap-3">
          <div class="mobile-toggle-menu"><i class="admin-icon" data-lucide="menu"></i></div>
          <div class="top-menu ms-auto">
            <ul class="navbar-nav align-items-center gap-1">

              <li class="nav-item d-none d-sm-flex">
                <a :href="frontendUrl" class="btn btn-fig-primary btn-fig-sm" target="_blank" rel="noopener noreferrer">Visit Website</a>
              </li>

              <li class="nav-item d-none d-md-flex">
                <!-- Opens in place: the button widens into the search field -->
                <CommandPalette ref="palette" :meta-key="metaKey" />
              </li>

              <li class="nav-item dropdown dropdown-user-setting">
                <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" data-bs-toggle="dropdown" href="javascript:;">
                  <div class="user-setting d-flex align-items-center gap-1">
                    <img :src="userAvatar" class="user-img" alt="user" />
                  </div>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <div class="dropdown-item d-flex flex-column align-items-center gap-1 py-3">
                      <img :src="userAvatar" class="rounded-circle" width="60" alt="user" />
                      <div class="text-center">
                        <p class="mb-0 fw-bold">{{ authUser?.name }}</p>
                        <p class="mb-0 text-secondary small">{{ authUser?.email }}</p>
                      </div>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><a class="dropdown-item" :href="route('profileSetting')"><i class="admin-icon me-2" data-lucide="user"></i>Profile</a></li>
                  <li>
                    <form method="POST" :action="route('logout')" @submit.prevent="logout">
                      <button type="submit" class="dropdown-item"><i class="admin-icon me-2" data-lucide="log-out"></i>Logout</button>
                    </form>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
        </nav>
      </div>
    </header>
    <!-- ── /Topbar ── -->

    <!-- ── Page content ───────────────────────────────── -->
    <div class="page-wrapper">
      <slot />
    </div>

    <!-- Overlay (mobile sidebar close) -->
    <div id="overlay" class="overlay toggle-icon" @click="closeOverlay"></div>

    <!-- Back to top -->
    <button
      type="button"
      class="back-to-top"
      :class="{ 'is-visible': showBackToTop }"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <i class="admin-icon" data-lucide="arrow-up"></i>
    </button>

    <!-- Confirmation dialog, driven by utils/confirmDelete -->
    <ConfirmDialog />

    <!-- ⌘K navigation -->

    <!-- Toasts, driven by utils/toast -->
    <ToastHost />

  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, nextTick, ref, watch } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue'
import CommandPalette from '@/components/Admin/CommandPalette.vue'
import ToastHost from '@/components/Admin/ToastHost.vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import { toast } from '@/utils/toast'

const page = usePage()

const adminLogo        = computed(() => page.props.adminLogo ?? '/assets/images/logo/logo.png')
const authUser         = computed(() => page.props.auth?.user ?? null)

const palette = ref(null)

// Show the shortcut the way this platform writes it.
const metaKey = computed(() =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform ?? '') ? '⌘' : 'Ctrl '
)

const frontendUrl = computed(() => window.location.origin)

const userAvatar = computed(() => {
  if (!authUser.value) return 'https://ui-avatars.com/api/?name=Admin&background=1a2110&color=fff&size=64'
  const initials = encodeURIComponent((authUser.value.name ?? 'A').substring(0, 2))
  return `https://ui-avatars.com/api/?name=${initials}&background=1a2110&color=fff&size=64`
})



function closeOverlay() {
  document.getElementById('overlay')?.classList.remove('show')
  document.querySelector('.sidebar-wrapper')?.classList.remove('show')
}

// ── Sidebar collapse ──────────────────────────────────────
// Previously handled by the theme's jQuery bundle, which bound its handlers
// once on DOM ready. This layout remounts on every Inertia visit, so those
// bindings were lost after the first navigation and the toggle went dead.
// The collapsed state is persisted so it survives navigation and reloads.
const SIDEBAR_KEY = 'admin.sidebarCollapsed'
const sidebarCollapsed = ref(false)

function applySidebarState() {
  const wrapper = document.querySelector('.wrapper')
  if (!wrapper) return
  wrapper.classList.toggle('toggled', sidebarCollapsed.value)
  if (!sidebarCollapsed.value) wrapper.classList.remove('sidebar-hovered')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed.value ? '1' : '0')
  applySidebarState()
}

function onSidebarEnter() {
  if (sidebarCollapsed.value) document.querySelector('.wrapper')?.classList.add('sidebar-hovered')
}

function onSidebarLeave() {
  document.querySelector('.wrapper')?.classList.remove('sidebar-hovered')
}

// ── Back to top ───────────────────────────────────────────
const showBackToTop = ref(false)

function onScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

async function logout() {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  await fetch(route('logout'), { method: 'POST', headers: { 'X-CSRF-TOKEN': token } })
  window.location.href = '/admin'
}

// Lucide replaces <i data-lucide> placeholders with <svg>, so it has to run
// again after every Inertia visit. MetisMenu is gone: the sidebar is a Vue
// accordion that keeps its own state.
function initPlugins() {
  nextTick(() => {
    if (typeof window.lucide !== 'undefined') window.lucide.createIcons()
  })
}


// Flash messages arrive as props on every Inertia response, so they are
// watched rather than read once on mount. That distinction is the whole
// feature: saving a form redirects back to the same page, Vue patches this
// layout in place instead of remounting it, and a one-shot read on mount
// therefore showed nothing for the most common case in the panel. Each
// response carries a fresh props object, so a plain reference watch fires
// even when two consecutive saves report the same message.
watch(
  () => page.props.flash,
  (next) => {
    if (!next) return
    if (next.success) toast('success', next.success)
    if (next.error) toast('error', next.error)
  },
  { immediate: true },
)

onMounted(() => {
  initPlugins()

  // Mobile overlay toggle
  document.querySelector('.mobile-toggle-menu')?.addEventListener('click', () => {
    document.getElementById('overlay')?.classList.toggle('show')
    document.querySelector('.sidebar-wrapper')?.classList.toggle('show')
  })

  // Restore the collapsed sidebar the user last chose
  sidebarCollapsed.value = localStorage.getItem(SIDEBAR_KEY) === '1'
  applySidebarState()

  const sidebar = document.querySelector('.sidebar-wrapper')
  sidebar?.addEventListener('mouseenter', onSidebarEnter)
  sidebar?.addEventListener('mouseleave', onSidebarLeave)

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  const sidebar = document.querySelector('.sidebar-wrapper')
  sidebar?.removeEventListener('mouseenter', onSidebarEnter)
  sidebar?.removeEventListener('mouseleave', onSidebarLeave)
  window.removeEventListener('scroll', onScroll)
})

// Re-init on Inertia page visits
router.on('finish', () => initPlugins())
</script>

<style scoped>
.menu-label {
  padding: 18px 20px 6px;
  pointer-events: none;
}
.menu-label:first-child {
  padding-top: 6px;
}
.menu-label span {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}
</style>
