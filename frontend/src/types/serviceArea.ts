export type ServiceArea = {
  id: number;
  name: string;
  description?: string | null;
  boundary_wkt: string;
  created_at: string;
};