// DirectionContext.js
import React, { createContext, useContext, useState } from "react";

const DirectionContext = createContext();

export const useDirection = () => useContext(DirectionContext);

export const DirectionProvider = ({ children }) => {
  const [direction, setDirection] = useState(1);

  const handleNavigation = (newPath) => {
    const pages = ["/", "/lab2", "/lab3"];
    const prevIndex = pages.indexOf(window.location.pathname);
    const currentIndex = pages.indexOf(newPath);
    console.log(window.location.pathname + " to " + newPath);
    setDirection(currentIndex > prevIndex ? 1 : -1);
  };

  return (
    <DirectionContext.Provider value={{ direction, handleNavigation }}>
      {children}
    </DirectionContext.Provider>
  );
};
