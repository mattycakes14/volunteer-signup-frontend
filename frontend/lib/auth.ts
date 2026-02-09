import {
  type CreateUserData,
  type AuthResponse,
  type RefreshResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function getTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("email");
}

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

/**
 * Sign up a new user.
 *
 * Backend AuthResponse returns: access_token, refresh_token, user_id, email, email_verified.
 * Tokens may be null if email is not yet verified.
 */
export async function signUp(data: CreateUserData): Promise<AuthResponse> {
  if (!data.email.endsWith("@uw.edu")) {
    throw new Error("Email must be a @uw.edu address");
  }

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(
        error.error || `signup failed with status: ${res.status}`,
      );
    }

    const authData: AuthResponse = await res.json();

    if (authData.access_token && authData.refresh_token) {
      setTokens(authData.access_token, authData.refresh_token);
    }

    localStorage.setItem("user_id", authData.user_id);
    localStorage.setItem("email", authData.email);

    return authData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Sign up failed with unknown network error");
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(
        error.error ||
          `signin failed with error code: ${res.status} w/ text: ${res.statusText}`,
      );
    }

    const authData: AuthResponse = await res.json();

    if (authData.access_token && authData.refresh_token) {
      setTokens(authData.access_token, authData.refresh_token);
    }

    localStorage.setItem("user_id", authData.user_id);
    localStorage.setItem("email", authData.email);

    return authData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Sign in failed");
  }
}

export async function signOut() {
  clearTokens();
  window.location.href = "/login";
}

export async function refreshAccessToken(): Promise<string> {
  const { refresh } = getTokens();

  if (!refresh) {
    throw new Error("No refresh token");
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Token refresh failed");
    }

    const json: RefreshResponse = await res.json();

    if (!json.access_token) {
      throw new Error("Invalid refresh response");
    }

    // update access token in local storage
    localStorage.setItem("access_token", json.access_token);

    return json.access_token;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Refresh token failure");
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getSession() {
  const { access, refresh } = getTokens();
  const userId = localStorage.getItem("user_id");

  if (!access || !refresh || !userId) {
    return null;
  }

  return {
    access_token: access,
    refresh_token: refresh,
    user_id: userId,
    email: localStorage.getItem("email"),
  };
}

export function getUserId(): string | null {
  return localStorage.getItem("user_id");
}
