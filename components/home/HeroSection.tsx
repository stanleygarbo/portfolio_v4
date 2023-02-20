import gsap from "gsap";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { wait } from "../../util/wait";

const HeroSection: React.FC<{
  shouldDelay: boolean;
  isWindowLoaded: boolean;
}> = ({ shouldDelay, isWindowLoaded }) => {
  const { colors, isDarkMode } = useTheme();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    console.log(isWindowLoaded);
    if (isWindowLoaded) {
      (async () => {
        if (shouldDelay) {
          await wait(1400);
          setShouldShow(true);
        } else {
          await wait(1700);
          setShouldShow(true);
        }
      })();

      gsap.fromTo(
        ".hero-content__name",
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          delay: 0.3,
        }
      );

      gsap.fromTo(
        ".hero-content__tagline__first",
        {
          y: 100,
        },
        {
          y: 0,
          delay: 0.5,
        }
      );
      gsap.fromTo(
        ".hero-content__tagline__second",
        {
          y: 100,
        },
        {
          y: 0,
          delay: 0.7,
        }
      );

      gsap.fromTo(
        ".hero-content__tagline__third",
        {
          y: 95,
        },
        {
          y: 0,
          delay: 0.9,
        }
      );
    }
  }, [isWindowLoaded, shouldDelay]);

  return (
    <Container
      id="hero"
      colors={colors}
      shouldDelay={shouldDelay}
      shouldShow={shouldShow}
      isDarkMode={isDarkMode}
      isLoaded={isWindowLoaded}
    >
      <div className="cover ">
        <i className="cover__text">Loading the greatness...</i>
      </div>
      <div className="hero-content ">
        <div className="hero-content__intro hero-content__name">
          <div className="hero-content__intro__bullet"></div>
          Hi, I am&nbsp;<span>Stanley Garbo</span>
        </div>
        <h1 className="hero-content__tagline">
          <div className="hero-content__tagline__cont overflow-hide">
            <div className="hero-content__tagline__first">
              I Craft Beautiful and
            </div>
          </div>
          <div className="hero-content__tagline__cont overflow-hide">
            <div className="hero-content__tagline__second">
              Functional Solutions
            </div>
          </div>
          <div className="hero-content__tagline__cont overflow-hide">
            <div className="hero-content__tagline__third">
              One Pixel at a Time
            </div>
          </div>
        </h1>
      </div>
    </Container>
  );
};

const Container = styled.div<{
  colors: IColors;
  shouldDelay: boolean;
  shouldShow: boolean;
  isDarkMode: boolean;
  isLoaded: boolean;
}>`
  ${({ colors, shouldDelay, shouldShow, isLoaded }) => css`
    height: 100vh;
    width: 100%;
    z-index: 1;
    display: grid;
    place-items: center;

    @media (max-width: 670px) {
      place-items: unset;

      align-items: center;
      padding: 30px;
    }

    .cover {
      background-color: ${colors.accent};
      width: 100%;
      height: 100%;
      position: fixed;
      bottom: 0;
      left: 0;

      z-index: 500;

      transition: height 0.7s;
      transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
      display: flex;
      align-items: center;
      justify-content: center;

      ${!isLoaded
        ? css`
            height: 100%;
          `
        : css`
            height: 0%;
            top: 0;
          `}

      &__text {
        color: #fff;
        opacity: 0;
        transition: opacity 0.5s;
        transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
        font-size: 20px;

        ${!isLoaded &&
        css`
          opacity: 1;
        `}
      }
    }

    .overflow-hide {
      overflow: hidden;
    }

    .hero-content {
      &__tagline {
        color: ${colors.foreground1};
        min-width: 750px;
        font-size: 60px;
        font-weight: 600;
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
