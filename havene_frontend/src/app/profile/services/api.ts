// api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const resetPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/users/reset_password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Нууц үг сэргээхэд алдаа");
  }

  return res.json();
};
