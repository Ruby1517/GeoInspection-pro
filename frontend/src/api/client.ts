import axios from "axios";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const API_BASE_URL =
  trimmedApiBaseUrl.endsWith("/api")
    ? trimmedApiBaseUrl
    : `${trimmedApiBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
