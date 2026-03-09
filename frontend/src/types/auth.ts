export type LoginPayload = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type CurrentUser = {
  id: number;
  full_name: string;
  email: string;
  role: "admin" | "inspector" | "supervisor" | "contractor";
};