import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import NavBar from "./NavBar";
import SideSocials from "./SideSocials";
import { useRouter } from "next/router";
import VerticalEmail from "./VerticalEmail";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Container>
      <GlobalStyle colors={colors} isIndexPage={router.pathname === "/"} />
      <NavBar />
      <SideSocials />
      {router.pathname !== "/" && <VerticalEmail />}
      <main id="main">{children}</main>
    </Container>
  );
};

const GlobalStyle = createGlobalStyle<{
  colors: IColors;
  isIndexPage: boolean;
}>`
  ${({ colors, isIndexPage }) => css`
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
      /* overflow: ${isIndexPage ? "hidden" : "auto"} !important; */
    }

    a {
      color: ${colors.foreground1};
    }

    p {
      font-size: 16px;
      font-weight: 500;
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
