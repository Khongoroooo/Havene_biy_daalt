// src/app/components/navbar/types.ts
export interface TokenPayload {
  user_id: number;
  role_name: string;
  exp: number;
}

export type ViewMode = "login" | "signup" | "forgot";
