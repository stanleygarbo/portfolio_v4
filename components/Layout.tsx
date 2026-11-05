"use client";

import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import NavBar from "./NavBar";
import SideSocials from "./SideSocials";
import { usePathname } from "next/navigation";
import { ThemeContextProvider } from "../contexts/themeContext";
import type { IProjectTheme } from "../interfaces/IContentfulAPI";
import VerticalEmail from "./VerticalEmail";

const LayoutContent: React.FC<{
  children: React.ReactNode;
  isHome: boolean;
}> = ({ children, isHome }) => {
  const { colors } = useTheme();

  return (
    <Container>
      <GlobalStyle $colors={colors} />
      <NavBar />
      <SideSocials />
      {!isHome && <VerticalEmail />}
      <main id="main">{children}</main>
    </Container>
  );
};

const Layout: React.FC<{
  children: React.ReactNode;
  pageTheme?: IProjectTheme;
}> = ({ children, pageTheme }) => {
  const pathname = usePathname();

  return (
    <ThemeContextProvider key={pathname} pageTheme={pageTheme}>
      <LayoutContent isHome={pathname === "/"}>{children}</LayoutContent>
    </ThemeContextProvider>
  );
};

const GlobalStyle = createGlobalStyle<{
  $colors: IColors;
}>`
  ${({ $colors: colors }) => css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      /* transition: 0.3s; */
      font-family: "Poppins", sans-serif;
    }

    body {
      background: ${colors.customBodyColor
        ? colors.customBodyColor
        : colors.background1};
      overflow-x: hidden;

      transition: background 0.3s;
    }

    a {
      color: ${colors.foreground1};
    }

    p {
      font-size: 16px;
      font-weight: 500;
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `}

`;

const Container = styled.div`
  height: 100vh;

  #main {
    /* max-width: 1200px; */
    /* padding: 0px 50px; */
    margin: 0 auto;
    /* height: 100vh; */
  }
`;

export default Layout;
