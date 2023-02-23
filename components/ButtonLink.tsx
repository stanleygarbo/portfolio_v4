import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IButtonLink } from "../interfaces/IButtonLink";
import { IColors } from "../interfaces/IColors";
import { isMobile } from "react-device-detect";

const ButtonLink: React.FC<IButtonLink> = ({ text, href, style }) => {
  const { colors } = useTheme();
  const r = useRouter();

  return (
    <Link href={href} passHref>
      <Container colors={colors} style={style}>
        {text}
      </Container>
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

    ${!isMobile &&
    css`
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
  `}
`;

export default ButtonLink;
