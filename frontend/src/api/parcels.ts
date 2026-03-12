import { apiClient } from "./client";
import type { Parcel } from "../types/parcel";

export async function getParcels(): Promise<Parcel[]> {
  const response = await apiClient.get<Parcel[]>("/parcels/");
  return response.data;
}
