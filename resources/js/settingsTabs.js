/**
 * Tab sets for the settings areas. Each area is one sidebar entry; its screens
 * are reached through the tab strip at the top of the page.
 */
export const STORE_TABS = [
  { label: 'General',     route: 'admin.manage.index', permission: 'BasicInformation' },
  { label: 'Social links', route: 'admin.manage.social.media.links', permission: 'SocialMedia' },
  { label: 'Delivery',    route: 'admin.manage.delivery', permission: 'BasicInformation' },
  { label: 'Site logo',   route: 'admin.media.index', permission: 'MediaManage' },
  { label: 'Email / SMTP', route: 'admin.manage.smtpSetting', permission: 'BasicInformation' },
]

export const LAYOUT_TABS = [
  { label: 'Header', route: 'admin.layout.header' },
  { label: 'Footer', route: 'admin.layout.footer' },
]

export const INTEGRATION_TABS = [
  { label: 'Courier', route: 'couriarApi', permission: 'CouriarApi' },
  { label: 'SMS',     route: 'smsApi', permission: 'SmsApi' },
  { label: 'Payment gateway', route: 'paymentApi', permission: 'PaymentApi' },
  { label: 'bKash',   route: 'bkashApi', permission: 'PaymentApi' },
]

export const ACCESS_TABS = [
  { label: 'Admin users', route: 'role-user.index', permission: 'RoleUser' },
  { label: 'Roles',       route: 'role-permission.index', permission: 'RolePermission' },
]
