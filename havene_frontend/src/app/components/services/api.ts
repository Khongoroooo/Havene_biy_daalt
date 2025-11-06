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

export const confirmResetPassword = async (
  token: string,
  newPassword: string
) => {
  const res = await fetch(`${API_URL}/users/confirm_reset_password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Нууц үг шинэчлэхэд алдаа");
  }

  return res.json();
};

export const verifyEmail = async (token: string) => {
  const res = await fetch(`${API_URL}/users/verify_email/?token=${token}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Имэйл баталгаажуулахад алдаа");
  return data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("havene_token");
  if (!token) throw new Error("Токен олдсонгүй");

  const res = await fetch(`${API_URL}/users/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
  return data;
};
