import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setLoginState = (state, userData = null) => {
    setIsAuthenticated(state);
    localStorage.setItem("auth", state ? "true" : "false");

    if (state && userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(localStorage.getItem("auth") === "true");
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setLoginState, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useLoginState = () => useContext(AuthContext);
