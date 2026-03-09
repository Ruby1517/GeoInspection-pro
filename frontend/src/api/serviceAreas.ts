import { apiClient } from "./client";
import type { Inspection } from "../types/inspection";
import type { ServiceArea } from "../types/serviceArea";

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const response = await apiClient.get<ServiceArea[]>("/service-areas/");
  return response.data;
}

export async function getInspectionsInServiceArea(serviceAreaId: number): Promise<Inspection[]> {
  const response = await apiClient.get<Inspection[]>(`/service-areas/${serviceAreaId}/inspections`);
  return response.data;
}