// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  const setLoginState = (state) => {
    setIsAuthenticated(state);
    localStorage.setItem("auth", state ? "true" : "false");
  };

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(localStorage.getItem("auth") === "true");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setLoginState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useLoginState = () => useContext(AuthContext);
