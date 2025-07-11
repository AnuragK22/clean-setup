import { STORAGECONSTANTS } from "../constants/auth";
import Cookies from "js-cookie";

// In-memory fallback storage (not persistent)
let inMemoryAuthToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Store access token in a secure cookie
export const storeAuthToken = ({ token }: { token: string }) => {
  try {
    // Note: HttpOnly must be set server-side. Client sets non-HttpOnly cookie here.
    Cookies.set(STORAGECONSTANTS.AUTH_TOKEN, token, {
      secure: true, // Only send over HTTPS
      sameSite: "Strict", // Prevent CSRF
      expires: 1 / 24, // Expire in 1 hour (short-lived)
      path: "/api", // Scope to API routes
    });
  } catch {
    console.warn("Cookies are disabled. Using in-memory storage as fallback.");
    inMemoryAuthToken = token; // Fallback to in-memory
  }
};

// Get stored access token
export const getStoredAuthToken = (): string | null => {
  try {
    const token = Cookies.get(STORAGECONSTANTS.AUTH_TOKEN);
    if (token !== undefined) return token;
    return inMemoryAuthToken; // Check in-memory fallback
  } catch {
    console.warn("Error accessing cookies. Checking in-memory storage.");
    return inMemoryAuthToken;
  }
};

// Remove access token
export const removeAuthToken = () => {
  try {
    Cookies.remove(STORAGECONSTANTS.AUTH_TOKEN, { path: "/api" });
  } catch {
    console.warn("Error removing cookie. Clearing in-memory storage.");
  }
  inMemoryAuthToken = null;
};

// Store refresh token in a secure cookie
export const storeRefreshToken = ({
  refresh_token,
}: {
  refresh_token: string;
}) => {
  try {
    Cookies.set(STORAGECONSTANTS.REFRESH_TOKEN, refresh_token, {
      secure: true,
      sameSite: "Strict",
      expires: 7, // Expire in 7 days (longer-lived)
      path: "/api/refresh", // Scope to refresh endpoint
    });
  } catch {
    console.warn("Cookies are disabled. Using in-memory storage as fallback.");
    inMemoryRefreshToken = refresh_token;
  }
};

// Get stored refresh token
export const getStoredRefreshToken = (): string | null => {
  try {
    const token = Cookies.get(STORAGECONSTANTS.REFRESH_TOKEN);
    if (token !== undefined) return token;
    return inMemoryRefreshToken;
  } catch (error) {
    console.error(
      "Error accessing cookies. Checking in-memory storage.",
      error,
    );
    return inMemoryRefreshToken;
  }
};

// Remove refresh token
export const removeRefreshToken = () => {
  try {
    Cookies.remove(STORAGECONSTANTS.REFRESH_TOKEN, { path: "/api/refresh" });
  } catch {
    console.warn("Error removing cookie. Clearing in-memory storage.");
  }
  inMemoryRefreshToken = null;
};

// Check if cookies are supported
export function areCookiesEnabled() {
  try {
    Cookies.set("testCookie", "test", { expires: 1 / 1440 }); // 1 minute
    const value = Cookies.get("testCookie");
    Cookies.remove("testCookie");
    return value !== undefined;
  } catch {
    return false;
  }
}

// Clear all auth-related storage
export const clearAuthStorage = () => {
  removeAuthToken();
  removeRefreshToken();
};
