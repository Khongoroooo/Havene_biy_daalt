// api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const getProfile = async () => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("havene_token")
    : null;

  if (!token) {
    throw new Error("Нэвтрээгүй байна");
  }

  const res = await fetch(`${API_URL}/users/profile/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Профайл авахад алдаа гарлаа");
  }

  return res.json();
};
