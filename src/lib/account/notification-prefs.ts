export type NotificationPrefs = {
  scan_alerts: boolean;
  emergency_alerts: boolean;
  product_updates: boolean;
  order_updates: boolean;
  blog_updates: boolean;
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  scan_alerts: true,
  emergency_alerts: true,
  product_updates: false,
  order_updates: true,
  blog_updates: false,
};

export function parseNotificationPrefs(raw: unknown): NotificationPrefs {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_NOTIFICATION_PREFS };
  const o = raw as Record<string, unknown>;
  return {
    scan_alerts: o.scan_alerts !== false,
    emergency_alerts: o.emergency_alerts !== false,
    product_updates: o.product_updates === true,
    order_updates: o.order_updates !== false,
    blog_updates: o.blog_updates === true,
  };
}
