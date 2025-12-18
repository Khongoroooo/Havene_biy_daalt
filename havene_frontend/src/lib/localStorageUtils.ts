// lib/localStorageUtils.ts

import { jwtDecode } from "jwt-decode";

export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const getAllLocalStorageItems = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const items: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) items[key] = value;
    }
  }
  return items;
};

export interface DecodedToken {
  user_id: number;
  role_name: string;
  exp: number; // хугацаа
  iat: number; // цаг
  // өөр шаардлагатай талбарууд
}

export const getDecodedToken = (tokenKey: string = "havene_token"): DecodedToken | null => {
  const token = getLocalStorageItem(tokenKey);
  if (!token) return null;

  try {
    return jwtDecode(token) as DecodedToken;
  } catch {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.role_name ?? null;
};
