import Link from "next/link";
import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IButtonLink } from "../interfaces/IButtonLink";
import { IColors } from "../interfaces/IColors";

const ButtonLink: React.FC<IButtonLink> = ({ text, href }) => {
  const { colors } = useTheme();

  return (
    <Link href={href} passHref>
      <Container colors={colors}>{text}</Container>
    </Link>
  );
};

const Container = styled.a<{ colors: IColors }>`
  ${({ colors }) => css`
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

    &:hover {
      border-radius: 100px;
      background: ${colors.customForeground
        ? colors.customForeground
        : colors.foreground1};
      color: ${colors.customBodyColor
        ? colors.customBodyColor
        : colors.background1};
    }
  `}
`;

export default ButtonLink;
