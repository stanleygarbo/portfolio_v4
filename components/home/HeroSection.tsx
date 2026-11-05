"use client";

import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { useLoading } from "../LoadingProvider";
import { GlobalVars } from "../../GlobalVars";
import type { IColors } from "../../interfaces/IColors";

const HeroSection: React.FC = () => {
  const { colors } = useTheme();
  const { isReady } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(
        [
          ".hero-content__name",
          ".hero-content__tagline__first",
          ".hero-content__tagline__second",
          ".hero-content__tagline__third",
          ".hero-content__cta",
        ],
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
      );
    }, containerRef);

    return () => context.revert();
  }, [isReady]);

  return (
    <Container id="hero" $colors={colors} ref={containerRef}>
      <Image
        className="lines"
        src="/lines.svg"
        alt=""
        width={243}
        height={122}
      />
      <div className="hero-content">
        <div className="hero-content__intro hero-content__name">
          <div className="hero-content__intro__bullet" />
          Hi, I am&nbsp;<span>Stanley Garbo</span>
        </div>
        <h1 className="hero-content__tagline">
          <span className="hero-content__tagline__cont overflow-hide">
            <span className="hero-content__tagline__first">
              I Craft Beautiful and
            </span>
          </span>
          <span className="hero-content__tagline__cont overflow-hide">
            <span className="hero-content__tagline__second">
              Functional Solutions
            </span>
          </span>
          <span className="hero-content__tagline__cont overflow-hide">
            <span className="hero-content__tagline__third">
              One Pixel at a Time
            </span>
          </span>
        </h1>
        <a className="hero-content__cta" href={`mailto:${GlobalVars.email}`}>
          hire me
        </a>
      </div>
    </Container>
  );
};

const Container = styled.div<{ $colors: IColors }>`
  ${({ $colors: colors }) => css`
    height: 100vh;
    width: 100%;
    z-index: 1;
    display: grid;
    place-items: center;
    // background: url('/lines.svg');
    // background-size: 100%;
    // background-repeat:no-repeat;
    overflow: hidden;
    .lines {
      display: none;
    }

    @media (max-height: 700px) {
      min-height: 750px;
    }

    @media (max-width: 670px) {
      place-items: unset;
      align-items: center;
      padding: 30px;
      position: relative;
      z-index: 1;

      .hero-content {
        position: absolute;
        bottom: 100px;
        left: 30px;
      }

      .lines {
        position: absolute;
        transform: rotate(180deg);
        height: 50%;
        justify-self: center;
        top: 0;
        display: block;
        width: auto;
      }

      // background-size: 750px;
      // background-position-x: center;
    }

    .hero-content__cta {
      text-decoration: none;
      width: fit-content;
      position: relative;
      background: none;
      color: ${colors.accent};
      display: flex;
      align-items: center;
      border: none;
      font-weight: 600;
      font-size: 17px;
      margin-top: 30px;
      text-transform: capitalize;
      cursor: pointer;
      z-index: 1;
      transition: color 0.3s;
      padding: 10px 20px;
      margin-left: -20px;

      &::before {
        content: "";
        position: absolute;
        right: -40%;
        width: 35px;
        height: 35px;
        border: 2px solid ${colors.accent};
        border-radius: 100px;
        transition: width 0.3s;
        z-index: -1;
      }

      &::after {
        content: "";
        position: absolute;
        right: -27%;
        width: 32px;
        height: 16px;
        background: url("/arrow.svg");
        background-repeat: no-repeat;
      }

      &:hover {
        color: ${colors.background1};

        &::before {
          width: 140px;
          background: ${colors.accent};
        }

        &::after {
          filter: invert(100%);
        }
      }
    }

    .overflow-hide {
      display: block;
      overflow: hidden;
    }

    .hero-content__tagline__cont > span {
      display: block;
    }

    .hero-content {
      &__tagline {
        color: ${colors.foreground1};
        min-width: 750px;
        font-size: 60px;
        font-weight: 700;
        position: relative;
        // left: -50px;

        @media (max-width: 850px) {
          min-width: 100%;
        }

        @media (max-width: 670px) {
          font-size: 40px;
        }

        @media (max-width: 500px) {
          font-size: 30px;
        }

        @media (max-width: 380px) {
          font-size: 28px;
        }

        &__third {
          color: ${colors.foreground1}99;
        }
      }

      &__intro {
        color: ${colors.foreground1};
        font-size: 17px;
        margin-bottom: 30px;
        position: relative;
        display: flex;
        align-items: center;
        span {
          color: ${colors.accent};
          font-weight: 600;
        }

        &__bullet {
          background: ${colors.accent};
          width: 10px;
          height: 10px;
          border-radius: 30%;
          margin-right: 20px;

          @media (max-width: 580px) {
            margin-right: 10px;
          }
        }
      }
    }
  `}
`;

export default HeroSection;
