// api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";


export const registerUser = async (email: string, password: string) => {
  console.log(API_URL)
  console.log("API_URL")
  const res = await fetch(`${API_URL}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Алдаа гарлаа");
  }

  return res.json();
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
