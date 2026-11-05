"use client";

import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import {
  IHomeScrollIndicator,
  IIndicators,
} from "../../interfaces/Home/IHomeScrollIndicator";
import { IColors } from "../../interfaces/IColors";

const sections = [
  { id: "hero", number: "01", label: "Hero" },
  { id: "about", number: "02", label: "About" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "contact", number: "04", label: "Contact" },
] as const;

const HomeScrollIndicator: React.FC<IHomeScrollIndicator> = ({
  indicators,
}) => {
  const { colors } = useTheme();

  return (
    <Container
      aria-label="Page sections"
      $colors={colors}
      $indicators={indicators}
    >
      <ul className="list">
        {sections.map(({ id, number, label }) => (
          <li key={id} className={`list__item list__item--${number}`}>
            <a
              href={`#${id}`}
              aria-label={`${number} ${label}`}
              aria-current={indicators[id] ? "location" : undefined}
            >
              <span className="list__item__number">{number}</span>
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const Container = styled.nav<{
  $colors: IColors;
  $indicators: IIndicators;
}>`
  ${({ $colors: colors, $indicators: indicators }) => css`
    position: fixed;
    right: 55px;
    bottom: 0;
    z-index: 5;

    .list {
      list-style-type: none;

      &__item {
        color: ${colors.customAccent
          ? colors.customAccent
          : colors.foreground1};
        position: relative;
        border-left: 1px dotted
          ${colors.customAccent ? colors.customAccent : colors.foreground1};

        font-size: 13px;

        a {
          display: block;
          padding: 30px 0 30px 15px;
          color: inherit;
          text-decoration: none;

          &:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 4px;
          }
        }

        &::before {
          background: ${colors.customAccent
            ? colors.customAccent
            : colors.foreground1};

          content: "";
          position: absolute;
          top: 0;
          left: -2px;

          width: 3px;
          height: 100%;

          background: ${colors.customAccent
            ? colors.customAccent
            : colors.foreground1};

          transition: 0.15s;
        }

        &--01 {
          &::before {
            opacity: ${indicators.hero ? "1" : "0"};
          }
        }
        &--02 {
          &::before {
            opacity: ${indicators.about ? "1" : "0"};
          }
        }

        &--03 {
          &::before {
            opacity: ${indicators.projects ? "1" : "0"};
          }
        }

        &--04 {
          &::before {
            opacity: ${indicators.contact ? "1" : "0"};
          }
        }
      }
    }

    @media (max-width: 850px) {
      display: none;
    }
  `}
`;

export default HomeScrollIndicator;
