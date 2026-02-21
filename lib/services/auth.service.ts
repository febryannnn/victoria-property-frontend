import { apiFetch } from "../http";

export function login(payload: {
  email: string;
  password: string;
}) {
  return apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: {
  email: string,
  password: string,
  username: string,
  phone_number: string
}) {
  return apiFetch("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      email: string;
      phone_number: string;
      role: number;
      username: string;
    };
  };
}