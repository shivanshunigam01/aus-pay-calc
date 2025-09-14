import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "ui.theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    // ✅ Default to light if nothing valid is saved
    return saved === "light" || saved === "dark" ? saved : "light";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
