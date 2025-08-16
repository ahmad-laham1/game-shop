import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
import client from "../api/client";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(
    () => !!localStorage.getItem("access")
  );

  async function login(username, password) {
    const { data } = await axios.post(`${API_BASE}/api/token/`, { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setIsAuthed(true);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthed(false);
    // hard redirect so all state resets
    window.location.assign("/login");
  }

  const value = useMemo(() => ({ isAuthed, login, logout }), [isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
