// ============================================================================
// API
// ============================================================================
// Fetch wrapper that automatically attaches JWT tokens to requests
// Handles token refresh on expiration, provides error handling, type-safe

import { getAccessToken, refreshAccessToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// CORE FETCH WRAPPER
// ============================================================================

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const token = getAccessToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    };

    let res = await fetch(`${API_URL}${endpoint}`, config);

    console.log(res);
    console.log(res.ok);

    // If 401 (token expired), refresh and retry ONCE
    if (res.status === 401) {
      try {
        await refreshAccessToken(); // Get new access token
        const newToken = getAccessToken();

        // Retry with new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };

        res = await fetch(`${API_URL}${endpoint}`, config);
      } catch (refreshError) {
        // Token refresh failed, redirect to login happens in refreshAccessToken()
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Handle HTTP errors
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new ApiError(
        error.detail ||
          error.error ||
          error.message ||
          `Request failed with status ${res.status}`,
        res.status,
      );
    }

    // Return typed response
    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network request failed");
  }
}

// dictionary that has the METHOD actions as keys and values are anonymous arrow functions that wrap apiFetch() and sets the method and body
export const api = {
  /**
   * GET request
   * @example const events = await api.get<Event[]>('/events');
   */
  get: <T>(endpoint: string): Promise<T> => {
    return apiFetch<T>(endpoint, { method: "GET" });
  },

  /**
   * POST request
   * @example const signup = await api.post<EventSignup>('/event-signups', { event_id: '123' });
   */
  post: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH request
   * @example const updated = await api.patch<Event>('/events/123', { description: 'New desc' });
   */
  patch: <T>(endpoint: string, data: unknown): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   * @example await api.delete('/event-signups/456');
   */
  delete: <T = void>(endpoint: string): Promise<T> => {
    return apiFetch<T>(endpoint, { method: "DELETE" });
  },
};
