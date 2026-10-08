<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="icon" href="{{ ($fav = getMedia('favicon')) ? asset($fav) : asset('favicon.svg') }}" type="image/svg+xml" />

    <!-- Lucide Icons -->
    {{-- Pinned to match the lucide-vue-next version in package.json. Previously
         @latest, which let an upstream release change the panel with no deploy. --}}
    <script src="https://unpkg.com/lucide@0.400.0/dist/umd/lucide.min.js"></script>

    {{-- FontAwesome, Bootstrap Icons and Boxicons all removed: Lucide is the
         only icon set. Migrated usages render as <i data-lucide="…">. --}}

    <!-- Admin plugins -->
    <link href="{{ asset('assets/plugins/simplebar/css/simplebar.css') }}" rel="stylesheet" />

    <!-- Bootstrap -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/bootstrap-extended.css') }}" rel="stylesheet">

    <!-- Select2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Manrope:wght@500;600;700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" crossorigin />

    <!-- Admin theme CSS -->
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/header-colors.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/custom.css') }}" />

    <!-- Editor/widget CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link href="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css" rel="stylesheet">

    {{-- Admin palette, typography and shell layout: resources/css/admin-shell.css (bundled by Vite below) --}}

    @inertiaHead
    @vite(['resources/js/admin.js'])
    @routes
</head>

<body>
    @inertia

    <!-- Bootstrap JS -->
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>
    <!-- jQuery (must come before other plugins) -->
    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <!-- Admin plugins -->
    <script src="{{ asset('assets/plugins/simplebar/js/simplebar.min.js') }}"></script>
    {{-- metisMenu removed: the sidebar is components/Admin/Sidebar.vue, a Vue
         accordion that keeps its own state across Inertia visits. --}}
    <script src="{{ asset('assets/plugins/apexcharts-bundle/js/apexcharts.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/apexcharts-bundle/js/apex-custom.js') }}"></script>
    <script src="{{ asset('assets/plugins/chartjs/js/chart.js') }}"></script>
    {{-- jQuery DataTables removed: every admin table is now components/Admin/DataTable.vue.
         The two libraries used to own the same DOM, so client-side sorting and paging
         disagreed with the server's and reset on every Inertia visit. --}}
    <!-- Summernote -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js"></script>
    <!-- Select2 -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="{{ asset('assets/plugins/select2/js/select2-custom.js') }}"></script>
    <!-- Flatpickr -->
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <!-- Tagify -->
    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.min.js"></script>
    {{-- SweetAlert2 removed: confirmations use components/Admin/ConfirmDialog.vue
         and toasts use components/Admin/ToastHost.vue, both styled like the panel. --}}
    {{-- Lucide icons are re-created by AdminLayout on mount and after every Inertia visit. --}}
    {{-- The global .deleteButton handler is gone: deletes go through
         utils/confirmDelete + ConfirmDialog, per component. --}}
</body>
</html>
