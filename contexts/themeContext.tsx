"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { colors } from "../theme/colors";
import { IThemeContext } from "../interfaces/contexts/IThemeContext";
import type { IProjectTheme } from "../interfaces/IContentfulAPI";

const themeContext = createContext<IThemeContext>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  colors: colors.darkMode,
  setProjectTheme: () => {},
});

const useThemeContext = (pageTheme?: IProjectTheme) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [projectTheme, setProjectTheme] = useState<IProjectTheme | null>(null);
  const activeTheme = pageTheme ?? projectTheme;

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((previous) => !previous);
  };

  return {
    isDarkMode,
    toggleDarkMode,
    colors: {
      ...(isDarkMode ? colors.darkMode : colors.lightMode),
      customAccent: activeTheme?.accent ?? "",
      customBodyColor: activeTheme?.background ?? "",
      customForeground: activeTheme?.foreground ?? "",
      customAccentForeground: activeTheme?.accentForeground ?? "",
    },
    setProjectTheme,
  };
};

export const ThemeContextProvider: React.FC<{
  children: React.ReactNode;
  pageTheme?: IProjectTheme;
}> = ({ children, pageTheme }) => {
  const theme = useThemeContext(pageTheme);
  return (
    <themeContext.Provider value={theme}>{children}</themeContext.Provider>
  );
};

export const useTheme = () => useContext(themeContext);
