const API_URL = "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  console.log("FETCHING:", `${API_URL}${path}`);
  console.log("STATUS:", res.status);

  const text = await res.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || "Invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}

export async function apiAdminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");

  }

  return data;
}

export async function imageFetch<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const text = await res.text();

  if (!res.ok) {
    let message = "Image Upload Failed";
    try {
      const errorData = JSON.parse(text);
      message = errorData?.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }

  if (!text) return null as T;

  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}