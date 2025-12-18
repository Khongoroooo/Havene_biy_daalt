// src/app/components/services/api.ts
export async function apiRequest(path: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : path;

  const headers = new Headers(options.headers || {});
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("havene_token");
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && options.body && typeof options.body === "object") {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw json;
    return json;
  } catch (err) {
    if (!res.ok) throw err;
    return text;
  }
}
