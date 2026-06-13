import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserRecord } from "@/lib/analytics";

interface AuthContextType {
  user: UserRecord | null;
  setUser: (u: UserRecord | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

const SESSION_KEY = "petsitter_user_id";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserRecord | null>(null);

  // Restore session from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setUserState(JSON.parse(saved) as UserRecord);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const setUser = (u: UserRecord | null) => {
    setUserState(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
