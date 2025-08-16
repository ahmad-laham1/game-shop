import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from "./tokens.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE,
});

// Attach access token on every request if present
client.interceptors.request.use((config) => {
  const isAuthEndpoint =
    config.url?.includes("/api/token/") ||
    config.url?.includes("/api/token/refresh/") ||
    config.url?.includes("/api/signup/");
  if (!isAuthEndpoint) {
    const access = getAccessToken();
    if (access) config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// If a 401 happens, try refreshing once, then retry the original request
let isRefreshing = false;
let pendingRequests = [];

function onRefreshed(newAccess) {
  pendingRequests.forEach((cb) => cb(newAccess));
  pendingRequests = [];
}

// Handle 401 errors by refreshing the token
// and retrying the original request
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        // no refresh token → force login
        removeAccessToken();
        window.location.assign("/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve) => {
          pendingRequests.push((newAccess) => {
            original.headers.Authorization = `Bearer ${newAccess}`;
            resolve(client(original));
          });
        });
      }

      try {
        isRefreshing = true;
        const resp = await axios.post(`${API_BASE}/api/token/refresh/`, {
          refresh,
        });
        const newAccess = resp.data.access;
        setAccessToken(newAccess);
        isRefreshing = false;
        onRefreshed(newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return client(original);
      } catch (e) {
        isRefreshing = false;
        pendingRequests = [];
        removeAccessToken();
        removeRefreshToken();
        window.location.assign("/login");
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
