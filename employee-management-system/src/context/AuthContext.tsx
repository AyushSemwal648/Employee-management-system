import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { UserType } from "../types/type";
import axios from "axios";

interface AuthContextType {
  user: UserType | null;
  login: (user: UserType, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          console.log("Token found, verifying user...");
          const response = await axios.get(
            "http://localhost:8000/api/auth/verify",
              
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Verify response:", response.data);

          if (response.data.success && response.data.user) {
            console.log("User verified:", response.data.user);
            setUser(response.data.user);
          } else {
            console.log("Verification failed, removing token");
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          console.log("No token found");
          setUser(null);
        }
      } catch (error) {
        console.error("Verification error:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (user: UserType, token: string) => {
    console.log("Login called with user:", user);
    console.log("Login called with token:", token);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    console.log("Logout called");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
