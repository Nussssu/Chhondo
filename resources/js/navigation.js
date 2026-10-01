/**
 * The admin navigation, in one place.
 *
 * Both the sidebar and the ⌘K command palette read from this, so a screen
 * can never appear in one and not the other — which is how seven built
 * screens ended up unreachable.
 *
 * Grouping is by how often a shop manager touches something, not by the
 * folder the controller lives in: daily work first, configuration last.
 *
 * Each item: { label, route, permission?, match?, badge?, badgeTitle? }
 *  - route      Ziggy route name
 *  - permission key from adminPermissions; omitted means always visible
 *  - match      route pattern for the active state (defaults to `route`)
 *  - badge      key on the Inertia page props holding a count
 *  - badgeTitle what the count means, shown on hover (e.g. "orders waiting")
 */
export const NAV = [
  {
    items: [
      { label: 'Dashboard', route: 'dashboard', icon: 'layout-dashboard', permission: 'Dashboard' },
    ],
  },

  {
    label: 'Daily',
    items: [
      { label: 'Orders', route: 'admin.orders.index', icon: 'clipboard-list', permission: 'OrderManagement', badge: 'adminPendingOrderCount', badgeTitle: 'orders waiting to be processed', match: 'admin.orders.index' },
      { label: 'POS orders', route: 'admin.orders.pos', icon: 'receipt', permission: 'OrderManagement', badge: 'adminPendingPosOrderCount', badgeTitle: 'counter sales waiting to be processed', match: 'admin.orders.pos' },
      { label: 'POS',       route: 'admin.pos.manage', icon: 'monitor', permission: 'PosManagement', match: 'admin.pos.*' },
      { label: 'Reviews',   route: 'admin.pages.reviews.index', icon: 'star', permission: 'Comment', badge: 'adminPendingReviewCount', badgeTitle: 'reviews awaiting approval' },
      // Was reachable only from a small topbar icon.
      { label: 'Messages',  route: 'admin.contact-messages.index', icon: 'mail', badge: 'adminUnreadMessageCount', badgeTitle: 'unread messages', match: 'admin.contact-messages.*' },
      { label: 'Customers', route: 'users', icon: 'users', permission: 'UserInformation' },
    ],
  },

  {
    label: 'Catalog',
    items: [
      { label: 'Products',    route: 'products.index', icon: 'package', permission: 'AllProduct', match: 'products.*' },
      { label: 'Categories',  route: 'admin.categories.index', icon: 'folder-tree', permission: 'AddCategory' },
      // Moved out of "Content Manage": its overwhelming use is product imagery.
      { label: 'Media library', route: 'admin.media-library.index', icon: 'image', permission: 'MediaManage' },
    ],
  },

  {
    label: 'Purchasing',
    items: [
      { label: 'Suppliers', route: 'admin.suppliers.index', icon: 'truck', permission: 'SupplierList' },
      { label: 'Purchases', route: 'admin.purchase.index', icon: 'shopping-cart', permission: 'PurchaseList' },
      // Route is admin.purchase.payment.history — supplier payments, not finance.
      { label: 'Payment history', route: 'admin.purchase.payment.history', icon: 'receipt', permission: 'PurchaseList' },
    ],
  },

  {
    label: 'Marketing',
    items: [
      { label: 'Coupons',       route: 'admin.coupons.index', icon: 'ticket', permission: 'CouponList' },
      { label: 'SMS promotion', route: 'sms.promotion', icon: 'message-square', permission: 'SmsApi' },
      // Moved out of Settings — its name says where it belongs.
      { label: 'Marketing tools', route: 'admin.marketing-tools.index', icon: 'megaphone', permission: 'MarketingTool' },
      { label: 'Accounts',  route: 'admin.account.dashboard', icon: 'wallet', permission: 'AccountManagement' },
      { label: 'Analytics', route: 'admin.analytics', icon: 'bar-chart-3', permission: 'AnalyticsDashboard' },
    ],
  },

  {
    label: 'Content',
    items: [
      // One entry: the listing covers every storefront page, and each page's
      // editor owns everything on it — banners included.
      { label: 'Pages',        route: 'admin.pages.index', icon: 'book-open', match: ['admin.pages.index', 'admin.pages.edit'] },
      { label: 'Blog posts',   route: 'blogs.index', icon: 'file-text', permission: 'Blogs', match: 'blogs.*' },
      { label: 'Blog categories', route: 'blog-category.index', icon: 'folder', permission: 'BlogCategory' },
    ],
  },

  {
    label: 'Settings',
    items: [
      // Each of these is one entry with tabs across its screens, rather than a
      // sidebar dropdown.
      // Header and footer are their own thing, not pages.
      { label: 'Header & footer', route: 'admin.layout.header', icon: 'panel-top', match: ['admin.layout.*'] },
      { label: 'Store settings', route: 'admin.manage.index', icon: 'settings', permission: 'BasicInformation', match: ['admin.manage.*', 'admin.media.index'] },
      { label: 'Integrations',   route: 'couriarApi', icon: 'plug', permission: 'CouriarApi', match: ['couriarApi', 'smsApi'] },
      { label: 'Access & roles', route: 'role-user.index', icon: 'shield-check', permission: 'RoleUser', match: ['role-user.*', 'role-permission.*'] },
    ],
  },
]

/**
 * Filter the tree down to what this user may see, dropping any group or
 * parent left with no reachable children.
 */
export function visibleNav(can) {
  const allowed = (item) => !item.permission || can(item.permission)

  return NAV.map((group) => {
    const items = group.items.filter(allowed).map((item) => {
      if (!item.children) return item
      const children = item.children.filter(allowed)
      return children.length ? { ...item, children } : null
    }).filter(Boolean)

    return items.length ? { ...group, items } : null
  }).filter(Boolean)
}

/** Flatten to leaf destinations, for the command palette. */
export function navDestinations(can) {
  const out = []
  for (const group of visibleNav(can)) {
    for (const item of group.items) {
      if (item.children) {
        for (const child of item.children) {
          out.push({ ...child, group: `${group.label ?? ''} › ${item.label}`.replace(/^ › /, '') })
        }
      } else {
        out.push({ ...item, group: group.label ?? '' })
      }
    }
  }
  return out
}
