
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, Admin, Teacher } from "@/types";
import { toast } from "sonner";

// Sample users for testing
const SAMPLE_USERS = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@school.edu",
    role: "admin",
    password: "admin123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-1",
    name: "John Smith",
    email: "jsmith@school.edu",
    gender: "Male",
    contact: "555-123-4567",
    assignedClass: "Science",
    role: "teacher",
    password: "teacher123",
    qrCode: "teacher-1-qr",
    createdAt: new Date().toISOString(),
  },
  {
    id: "scanner-1",
    name: "Sarah QR",
    email: "scanner@school.edu",
    role: "scanner",
    password: "scanner123",
    createdAt: new Date().toISOString(),
  }
];

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
          setAuthState({
            ...initialAuthState,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          ...initialAuthState,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = SAMPLE_USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Remove password before storing
      const { password: _, ...safeUser } = user;
      
      // Store user in localStorage (for demo purposes)
      localStorage.setItem("user", JSON.stringify(safeUser));
      
      setAuthState({
        user: safeUser as Admin | Teacher,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success(`Welcome back, ${safeUser.name}!`);
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate("/login");
    toast.success("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
