"use client";

import Link from "./SiteLink";
import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IButtonLink } from "../interfaces/IButtonLink";
import { IColors } from "../interfaces/IColors";

const ButtonLink: React.FC<IButtonLink> = ({ text, href, style }) => {
  const { colors } = useTheme();

  return (
    <Link style={{ textDecoration: "none" }} href={href}>
      <Container $colors={colors} style={style}>
        {text}
      </Container>
    </Link>
  );
};

const Container = styled.span<{ $colors: IColors }>`
  ${({ $colors: colors }) => css`
    display: block;
    padding: 10px 70px;
    border: 1px solid
      ${colors.customForeground
        ? colors.customForeground
        : colors.foreground1 + 50};

    color: ${colors.customForeground
      ? colors.customForeground
      : colors.foreground1 + "cc"};

    border-radius: 2px;
    text-decoration: none;
    transition: 0.3s;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-radius: 100px;
        background: ${colors.customForeground
          ? colors.customForeground
          : colors.foreground1};
        color: ${colors.customBodyColor
          ? colors.customBodyColor
          : colors.background1};
      }
    }
  `}
`;

export default ButtonLink;
