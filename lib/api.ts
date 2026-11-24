
import type { ApiErrorResponse } from "@/types/api-response";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<
    string,
    string | number | boolean | null | undefined
  >;
  body?: unknown;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: ApiErrorResponse["error"]["details"] = []
  ) {
    super(message);
    this.name = "ApiException";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers, ...init } = options;

  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const url = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let error: ApiErrorResponse["error"];

    try {
      const payload = await response.json();
      error = payload.error;
    } catch {
      error = {code : "", message : "", details : []};
    }

    throw new ApiException(
      response.status,
      error?.code ?? "http_error",
      error?.message ?? response.statusText,
      error?.details ?? []
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(
    endpoint: string,
    params?: RequestOptions["params"],
    options?: Omit<RequestOptions, "params" | "method" | "body">
  ) {
    return request<T>(endpoint, {
      ...options,
      method: "GET",
      params,
    });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: "POST",
      body,
    });
  },

  put<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: "PUT",
      body,
    });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: "PATCH",
      body,
    });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, {
      method: "DELETE",
    });
  },
};
