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
  login: (user: UserType) => void;
  logout: () => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const  verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get(
            "http://localhost:8000/api/auth/verify", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
          );

          if (response.data.success) {
            setUser(response.data.user);
          }
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          !error.response.data.success
        ) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    };

    verifyUser()
  }, []);

  const login = (user: UserType | null) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook for using the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
