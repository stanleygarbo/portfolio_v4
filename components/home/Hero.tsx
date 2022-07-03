import gsap from "gsap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { wait } from "../../util/wait";
import ContentBox from "../ContentBox";
import RoundText from "./RoundText";

const Hero: React.FC<{ shouldDelay: boolean; isWindowLoaded: boolean }> = ({
  shouldDelay,
  isWindowLoaded,
}) => {
  const { colors, isDarkMode } = useTheme();
  const [shouldShow, setShouldShow] = useState(false);

  const router = useRouter();

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
        ".wrapper__text__title__first__name",
        {
          y: 100,
        },
        {
          y: 0,
          delay: 2.3,
        }
      );
      gsap.fromTo(
        ".wrapper__text__title__last__name",
        {
          y: 100,
        },
        {
          y: 0,
          delay: 2.5,
        }
      );

      gsap.fromTo(
        ".wrapper__text__cont__paragraph",
        {
          y: 95,
        },
        {
          y: 0,
          delay: 2.7,
        }
      );
    }
  }, [isWindowLoaded, shouldDelay]);

  return (
    <Container
      colors={colors}
      shouldDelay={shouldDelay}
      shouldShow={shouldShow}
      isDarkMode={isDarkMode}
      isLoaded={isWindowLoaded}
      id="hero"
    >
      <div className="cover">
        <i className="cover__text">Loading the greatness...</i>
      </div>
      <div className="wrapper">
        <div className="wrapper__img">
          <div className="wrapper__img__animate"></div>
        </div>
        <div className="wrapper__text">
          <h1
            style={{ fontFamily: "VarinoNormal" }}
            className="wrapper__text__title"
          >
            <div className="wrapper__text__title__first">
              <div className="wrapper__text__title__first__name">STANLEY</div>
            </div>

            <div className="wrapper__text__title__last">
              <div className="wrapper__text__title__last__name">GARBO</div>
            </div>
          </h1>

          <div className="wrapper__text__cont">
            <p className="wrapper__text__cont__paragraph">
              I develop and ocasionally design stuff that interacts with smart
              contracts.
            </p>
          </div>
        </div>
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
  ${({ colors, shouldDelay, isDarkMode, shouldShow, isLoaded }) => css`
    height: 100vh;
    width: 100%;
    z-index: 1;

    .cover {
      background-color: ${colors.accent};
      width: 100%;
      height: 100%;
      position: fixed;
      bottom: 0;

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

    .wrapper {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px;
      align-items: center;
      justify-content: center;
      position: relative;

      &__img {
        position: absolute;
        left: 20px;

        width: 500px;
        height: calc(100% - 40px);

        ${shouldShow &&
        css`
          background-color: ${isDarkMode ? "#242424" : "#eeeeee"};
          background-image: url("/golden-hand.jpg");
          background-size: cover;
        `}

        &__animate {
          position: absolute;
          height: 100%;
          width: 0%;
          background-color: ${colors.accent};

          ${isLoaded &&
          css`
            animation: goRight 1.4s cubic-bezier(0.65, 0.05, 0.36, 1)
              ${shouldDelay ? ".7s" : isLoaded ? "1s" : ""};
          `}

          @keyframes goRight {
            0% {
              width: 0%;
            }
            50% {
              width: 100%;
            }
            100% {
              width: 0%;
              right: 0;
            }
          }
        }
      }

      &__text {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        &__cont {
          overflow: hidden;
          margin-right: -40px;
          position: relative;

          top: -250px;

          p {
            color: ${colors.foreground1}99;
            font-family: "Syne";
            letter-spacing: 1px;
            font-weight: 300;
            margin-top: 20px;
            max-width: 400px;
            font-size: 17px;
            text-align: center;
          }
        }

        &__title {
          font-weight: 500;
          font-size: 90px;
          position: relative;
          color: ${colors.foreground1};
          /* text-shadow: 10px 10px 20px ${colors.background1}; */
          font-family: "VarinoNormal";
          letter-spacing: 20px;
          line-height: 120px;
          position: relative;
          top: 100px;
          left: 50px;

          display: flex;
          flex-direction: column;

          &__last {
            margin-left: 160px;
          }

          &__first,
          &__last {
            overflow: hidden;
          }
        }

        @media (max-width: 1090px) {
          &__cont {
            margin-right: 10px;
          }

          &__title {
            left: 0px;
          }
        }
      }
    }

    @media (max-width: 850px) {
      height: fit-content;

      .wrapper {
        padding: 0px;
        align-items: flex-start;
        justify-content: flex-start;

        &__img {
          width: 100%;
          height: 400px;
          position: relative;
          left: 0;
          top: 0;
        }

        &__text {
          align-items: flex-start;

          &__title {
            top: 0px;
            padding: 30px;
            font-size: 50px;
            line-height: 60px;

            &__last {
              margin-left: 0px;
            }
          }

          &__cont {
            top: 0;
            margin-right: 0;

            p {
              margin-top: 0;
              font-size: 18px;
              text-align: left;
              padding: 30px;
            }
          }
        }
      }
    }

    @media (max-width: 486px) {
      .wrapper {
        &__text {
          &__title {
            font-size: 35px;
          }
        }
      }
    }

    @media (max-width: 402px) {
      .wrapper {
        &__text {
          &__title {
            letter-spacing: 15px;
            font-size: 30px;
            line-height: 50px;
          }
        }
      }
    }
  `}
`;

export default Hero;
