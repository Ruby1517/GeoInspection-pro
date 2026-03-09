import { apiClient } from "./client";
import type { CreateInspectionPayload, Inspection } from "../types/inspection";

export async function getInspections(): Promise<Inspection[]> {
  const response = await apiClient.get<Inspection[]>("/inspections/");
  return response.data;
}

export async function getInspectionById(id: number): Promise<Inspection> {
  const response = await apiClient.get<Inspection>(`/inspections/${id}`);
  return response.data;
}

export async function updateInspection(
  id: number,
  payload: Partial<CreateInspectionPayload> & { title?: string; description?: string }
): Promise<Inspection> {
  const response = await apiClient.patch<Inspection>(`/inspections/${id}`, payload);
  return response.data;
}

export async function createInspection(payload: CreateInspectionPayload): Promise<Inspection> {
  const response = await apiClient.post<Inspection>("/inspections/", payload);
  return response.data;
}

export type NearbyInspection = Inspection & {
  distance_meters: number;
};

export async function getNearbyInspections(params: {
  lat: number;
  lng: number;
  radius_meters: number;
}): Promise<NearbyInspection[]> {
  const response = await apiClient.get<NearbyInspection[]>("/inspections/nearby", {
    params,
  });

  return response.data;
}