<div align="center">

# Chhondo

**Full-stack fashion e-commerce platform with a Bangla storefront, admin CMS, POS, and courier and payment integrations.**

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vuedotjs&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-3-9553E9?logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php&logoColor=white)

</div>

---

## Overview

Chhondo is a production e-commerce application built for a Bangladeshi fashion brand. Customers browse and buy products through a fast, mobile-first Bangla storefront. The store team runs the business from one admin panel: catalog, orders, inventory and purchasing, marketing, content pages, and in-store sales through a built-in POS.

The app is a Laravel monolith that renders Vue 3 pages through Inertia.js (with SSR). Checkout stays synchronous, while order confirmations (SMS and email) go out on a dedicated queue so third-party services never slow down the customer.

## Features

**Storefront**
- Product catalog with categories, attributes and variant combinations, including custom blouse options
- Cart, wishlist, coupons, product campaigns, and reviews
- Checkout with cash on delivery, **bKash**, and **SSLCommerz** payments
- Customer accounts, saved addresses, and order tracking
- Blog, custom CMS pages, hero banners, sliders, and popups
- Bangla-first UI with international phone input and validation

**Admin panel**
- Dashboard and sales analytics
- Order management with **Pathao** and **Steadfast** courier integration (including Steadfast webhooks)
- Point of Sale (POS) for in-store orders
- Purchases, suppliers, stock transfers, and transactions
- Visual pages editor, menus, layout and site settings, media library with image optimization
- Marketing tools: promotional SMS, email templates, and coupons
- Role- and permission-based access control (`spatie/laravel-permission`)
- Maintenance mode that blocks the storefront while keeping admin available

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Backend | Laravel 13, PHP 8.4, Repository/Service architecture |
| Frontend | Vue 3, Inertia.js 3 (SSR), Pinia, Tailwind CSS 4, Vite |
| UI libraries | Swiper, Lucide & Phosphor icons, dotLottie, Day.js, Yup |
| Integrations | bKash, SSLCommerz, Pathao, Steadfast, SMS gateway, SMTP |
| Media | Intervention Image, Spatie Image Optimizer |
| Auth & roles | Spatie Laravel Permission |

## Screenshots

> 📸 Screenshots coming soon.

<!-- Add images to docs/screenshots/ and reference them here, for example:
![Storefront](docs/screenshots/storefront.png)
![Admin dashboard](docs/screenshots/admin-dashboard.png)
-->

## Getting Started

### Prerequisites

- PHP 8.4+ and Composer
- Node.js 20+ and npm (or pnpm)
- MySQL / MariaDB

### Installation

```bash
git clone https://github.com/Nussssu/Chhondo.git
cd Chhondo

# Create .env with your app, database, mail, payment and courier credentials
php artisan key:generate
php artisan migrate --seed

npm install
npm run build
php artisan storage:link
```

### Run locally

```bash
composer run dev   # Laravel server, queue listener, log viewer, and Vite together
```

Order confirmations use a dedicated queue. Keep this worker running in every environment:

```bash
php artisan queue:work database --queue=order-confirmations --sleep=1 --tries=1 --timeout=80
```

See [docs/order-confirmations.md](docs/order-confirmations.md) for details.

> **Deployment note:** `vendor/` is committed on purpose because the production host has no Composer. Do not add it to `.gitignore` without changing the deploy process.

## Project Structure

```
app/
├── Http/Controllers/   # Admin, storefront, payment and webhook controllers
├── Models/             # Product, Order, Coupon, Campaign, Supplier, ...
├── Repositories/       # Data access layer
├── Services/           # Business logic (courier, payments, marketing)
└── Jobs/               # Queued SMS and notification jobs
resources/js/Pages/
├── Admin/              # Admin panel (Vue)
└── Public/             # Storefront (Vue)
```

## Author

**Nusrat Jahan Ankhi** · [GitHub](https://github.com/Nussssu)
