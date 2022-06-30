import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import {
  IHomeScrollIndicator,
  IIndicators,
} from "../../interfaces/Home/IHomeScrollIndicator";
import { IColors } from "../../interfaces/IColors";

const HomeScrollIndicator: React.FC<IHomeScrollIndicator> = ({
  indicators,
}) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors} indicators={indicators}>
      <ul className="list">
        <li className="list__item list__item--01">
          <span className="list__item__number">01</span>
          <span className="list__item__name">Hero</span>
        </li>
        <li className="list__item list__item--02">
          <span className="list__item__number">02</span>
          <span className="list__item__name">About</span>
        </li>
        <li className="list__item list__item--03">
          <span className="list__item__number">03</span>
          <span className="list__item__name">Portfolio</span>
        </li>
        <li className="list__item list__item--04">
          <span className="list__item__number">04</span>
          <span className="list__item__name">Contact</span>
        </li>
      </ul>
    </Container>
  );
};

const Container = styled.aside<{
  colors: IColors;
  indicators: IIndicators;
}>`
  ${({ colors, indicators }) => css`
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
        padding: 30px 0 30px 15px;
        position: relative;
        border-left: 1px dotted
          ${colors.customAccent ? colors.customAccent : colors.foreground1};

        font-size: 13px;
        position: relative;

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

        &__name {
          display: none;
        }
      }
    }

    @media (max-width: 850px) {
      display: none;
    }
  `}
`;

export default HomeScrollIndicator;
