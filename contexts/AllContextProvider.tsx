import React from "react";
import { ThemeContextProvider } from "./themeContext";
import type { IProjectTheme } from "../interfaces/IContentfulAPI";

const AllContextProvider: React.FC<{
  children: React.ReactNode;
  pageTheme?: IProjectTheme;
}> = ({ children, pageTheme }) => {
  return (
    <ThemeContextProvider pageTheme={pageTheme}>
      {children}
    </ThemeContextProvider>
  );
};

export default AllContextProvider;
