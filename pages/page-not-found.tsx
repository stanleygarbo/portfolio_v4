import type { NextPage } from "next";
import Head from "next/head";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const PageNotFound: NextPage = () => {
  const { colors } = useTheme();

  return (
    <>
      <Head>
        <title>404 | Page Not Found</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container $colors={colors}>
        <h1>
          <span className="error-code">404</span>
          <span className="error-message">
            This page doesn&apos;t exist.
          </span>
        </h1>
      </Container>
    </>
  );
};

const Container = styled.div<{ $colors: IColors }>`
  ${({ $colors: colors }) => css`
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
    padding: 20px;
    h1 {
      color: ${colors.foreground1};
      display: flex;
      align-items: center;
      .error-code {
        padding-right: 20px;
        border-right: 1px solid ${colors.foreground1}60;
      }

      .error-message {
        font-size: 14px;
        font-weight: 400;
        margin-left: 20px;
      }
    }
  `}
`;

export default PageNotFound;
