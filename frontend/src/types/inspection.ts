export type Inspection = {
  id: number;
  inspection_number: string;
  title: string;
  description?: string | null;
  category_id: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_review" | "assigned" | "in_progress" | "resolved" | "closed";
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  created_by: number;
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateInspectionPayload = {
  title: string;
  description?: string;
  category_id: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_review" | "assigned" | "in_progress" | "resolved" | "closed";
  address?: string;
  latitude: number;
  longitude: number;
  assigned_to?: number | null;
};

export type NearbyInspection = Inspection & {
  distance_meters: number;
};