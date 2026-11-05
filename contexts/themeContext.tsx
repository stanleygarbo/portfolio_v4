"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { colors } from "../theme/colors";
import { IThemeContext } from "../interfaces/contexts/IThemeContext";
import type { IProjectTheme } from "../interfaces/IContentfulAPI";

const themeContext = createContext<IThemeContext>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  colors: colors.darkMode,
});

const useThemeContext = (pageTheme?: IProjectTheme) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [customAccent, setCustomAccent] = useState("");
  const [customAccentForeground, setCustomAccentForeground] = useState("");
  const [customBodyColor, setCustomBodyColor] = useState("");
  const [customForeground, setCustomForeground] = useState("");

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
      customAccent: pageTheme?.accent ?? customAccent,
      customBodyColor: pageTheme?.background ?? customBodyColor,
      customForeground: pageTheme?.foreground ?? customForeground,
      customAccentForeground:
        pageTheme?.accentForeground ?? customAccentForeground,
    },
    setCustomAccent,
    setCustomBodyColor,
    setCustomForeground,
    setCustomAccentForeground,
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
