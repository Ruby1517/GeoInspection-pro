import { apiClient } from "./client";
import type { Category, CreateCategoryPayload } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/categories/");
  return response.data;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const response = await apiClient.post<Category>("/categories/", payload);
  return response.data;
}