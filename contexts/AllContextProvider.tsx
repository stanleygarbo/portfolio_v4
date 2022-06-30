import React from "react";
import { ThemeContextProvider } from "./themeContext";

const AllContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  );
};

export default AllContextProvider;
