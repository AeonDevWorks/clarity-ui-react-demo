"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeValue = 0 | 1 | 2 | 3 | 4 | 5;

interface ThemeContextType {
  themeValue: ThemeValue;
  isSystem: boolean;
  setThemeValue: (value: ThemeValue) => void;
  setIsSystem: (isSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeValue, setThemeValue] = useState<ThemeValue>(4); // Default to Standard Dark
  const [isSystem, setIsSystem] = useState(true);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    let appliedTheme = themeValue;

    if (isSystem) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // Map system preference to Standard Light (1) or Standard Dark (4)
      appliedTheme = isDark ? 4 : 1;
    }

    root.setAttribute("data-theme", appliedTheme.toString());
    
    // Also manage 'dark' class for Tailwind if needed (though we are using variables heavily)
    if (appliedTheme >= 3) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

  }, [themeValue, isSystem]);

  // System listener
  useEffect(() => {
    if (!isSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
        // Trigger re-render/re-application
        const isDark = mediaQuery.matches;
        setThemeValue(isDark ? 4 : 1); // Only update value if we want the slider to reflect system state
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystem]);

  return (
    <ThemeContext.Provider value={{ themeValue, isSystem, setThemeValue, setIsSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
