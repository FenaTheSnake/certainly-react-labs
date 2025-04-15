import { useState, useCallback, useEffect } from "react";

export const useLoginState = () => {
  // Инициализируем состояние, проверяя значение из localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  // Функция для обновления состояния и сохранения его в localStorage
  const setLoginState = useCallback((state) => {
    setIsAuthenticated(state);
    localStorage.setItem("auth", state ? "true" : "false");
  }, []);

  // При изменении localStorage (например, в случае работы нескольких вкладок)
  // синхронизируем состояние
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("auth") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [ isAuthenticated, setLoginState ];
};
