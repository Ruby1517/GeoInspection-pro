export type Parcel = {
  id: number;
  apn: string;
  zoning_code?: string | null;
  owner_name?: string | null;
  address?: string | null;
  description?: string | null;
  boundary_wkt: string;
  created_at: string;
};
