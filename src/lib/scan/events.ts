export const FINDER_EVENT_TYPES = [
  "PROFILE_VIEWED",
  "REASON_SELECTED",
  "CALL_CLICKED",
  "WHATSAPP_CLICKED",
  "EMERGENCY_CLICKED",
  "LOCATION_SHARED",
] as const;

export type FinderEventType = (typeof FINDER_EVENT_TYPES)[number];

export function isFinderEventType(value: string): value is FinderEventType {
  return (FINDER_EVENT_TYPES as readonly string[]).includes(value);
}

export const REASONS_BY_KIND: Record<string, readonly string[]> = {
  vehicle: [
    "Wrong Parking",
    "Lights Left On",
    "Vehicle Damage",
    "Vehicle Being Towed",
    "Emergency",
  ],
  pet: ["Found Pet", "Injured Pet", "Running Loose", "Emergency"],
  child: ["Child Found", "Needs Assistance", "Medical Emergency"],
  business: ["Asset Found", "Asset Damaged", "Emergency"],
  asset: ["Asset Found", "Asset Damaged", "Emergency"],
};

export type ScanEventPayload = {
  qr_id: string;
  slug: string;
  event_type: FinderEventType;
  reason?: string;
  device?: string;
  browser?: string;
  latitude?: number;
  longitude?: number;
};

export type OwnerScanStats = {
  total_scans: number;
  today_scans: number;
  call_clicks: number;
  whatsapp_clicks: number;
  emergency_clicks: number;
  recent_events: FinderEventRow[];
};

export type FinderEventRow = {
  id: string;
  event_type: FinderEventType;
  reason: string | null;
  device: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  slug: string;
  tag_title: string;
  kind: string;
};

export function eventTypeLabel(type: FinderEventType): string {
  switch (type) {
    case "PROFILE_VIEWED":
      return "Scan";
    case "REASON_SELECTED":
      return "Reason selected";
    case "CALL_CLICKED":
      return "Call";
    case "WHATSAPP_CLICKED":
      return "WhatsApp";
    case "EMERGENCY_CLICKED":
      return "Emergency";
    case "LOCATION_SHARED":
      return "Location shared";
    default:
      return type;
  }
}
