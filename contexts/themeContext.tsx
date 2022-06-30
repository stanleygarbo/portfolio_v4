import React, { useState, useEffect, createContext, useContext } from "react";
import { colors } from "../theme/colors";
import { IThemeContext } from "../interfaces/contexts/IThemeContext";

const themeContext = createContext<IThemeContext>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: colors.lightMode,
});

const useThemeContext = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customAccent, setCustomAccent] = useState("");
  const [customAccentForeground, setCustomAccentForeground] = useState("");
  const [customBodyColor, setCustomBodyColor] = useState("");
  const [customForeground, setCustomForeground] = useState("");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == null) {
      setIsDarkMode(false);
    }
    if (theme === "light") setIsDarkMode(false);
    if (theme === "dark") setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  return {
    isDarkMode,
    toggleDarkMode,
    colors: {
      ...(isDarkMode ? colors.darkMode : colors.lightMode),
      customAccent,
      customBodyColor,
      customForeground,
      customAccentForeground,
    },
    setCustomAccent,
    setCustomBodyColor,
    setCustomForeground,
    setCustomAccentForeground,
  };
};

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useThemeContext();
  return (
    <themeContext.Provider value={theme}>{children}</themeContext.Provider>
  );
};

export const useTheme = () => useContext(themeContext);
