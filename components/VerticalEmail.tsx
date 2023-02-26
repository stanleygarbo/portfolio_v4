import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { GlobalVars } from "../GlobalVars";
import { IColors } from "../interfaces/IColors";

const VerticalEmail = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="vert-email">
        <a href={`mailto:${GlobalVars.email}`}>{GlobalVars.email}</a>
      </div>

      <div className="vert-line"></div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    position: fixed;
    right: 55px;
    bottom: 0px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 850px) {
      display: none;
    }

    .vert-email {
      writing-mode: vertical-rl;
      margin-bottom: 20px;
      a {
        color: ${colors.customAccent};
        text-decoration: none;
      }
    }

    .vert-line {
      width: 1px;
      height: 80px;
      background: ${colors.customAccent};
    }
  `}
`;

export default VerticalEmail;
