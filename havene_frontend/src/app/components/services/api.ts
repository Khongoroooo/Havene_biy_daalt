const API_URL = process.env.API_URL;

export const registerUser = async (email: string, password: string) => {
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
