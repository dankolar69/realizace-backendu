import type { ApiError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8888";

async function request<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | undefined> }
): Promise<T> {
  const url = new URL(path, BASE_URL);
  if (init?.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const err: ApiError = {
      code: data.code,
      message: data.message ?? `HTTP ${res.status}`,
      validationError: data.validationError,
    };
    throw err;
  }
  return data as T;
}

export function apiGet<T>(
  path: string,
  query?: Record<string, string | undefined>
): Promise<T> {
  return request<T>(path, { method: "GET", query });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}
