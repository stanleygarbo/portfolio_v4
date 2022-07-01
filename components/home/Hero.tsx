import gsap from "gsap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { wait } from "../../util/wait";
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
        }
      })();

      const tl = gsap.timeline();

      tl.fromTo(
        ".wrapper__obj__title__line__txt",
        {
          y: 70,
          skewX: 7,
        },
        {
          y: 0,
          skewX: 0,
          delay: shouldDelay ? 1.7 : 0.3,
          stagger: {
            amount: 0.3,
          },
        }
      );

      const tl2 = gsap.timeline();

      tl2.fromTo(
        ".wrapper__obj__desc",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          delay: 2.3,
        }
      );

      gsap.fromTo(
        ".wrapper__obj__cta",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          delay: 2.5,
        }
      );
      gsap.fromTo(
        ".wrapper__obj__round-txt",
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
          delay: 2.5,
        }
      );
    }
  }, [shouldDelay, isWindowLoaded]);

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
        <div className="wrapper__obj">
          <div className="wrapper__obj__cover">
            <div className="wrapper__obj__cover__animate"></div>
          </div>
          <div className="wrapper__obj__round-txt">
            <RoundText />
          </div>

          <h1 className="wrapper__obj__title">
            <div className="wrapper__obj__title__line">
              <div className="wrapper__obj__title__line__txt">Stanley</div>
            </div>
            <section className="wrapper__obj__title__line">
              <div className="wrapper__obj__title__line__txt">
                <div className="wrapper__obj__title__horiz"></div> Garbo
              </div>
            </section>
          </h1>
          <p className="wrapper__obj__desc">
            A frontend web3 developer specializing in developing and ocasionally
            designing stuff that interacts with smart contracts.
            {/* Hi! I&apos;m Stanley — a freelancer and web developer. I build
            high-quality stuff for the web. */}
          </p>
          <button
            className="wrapper__obj__cta"
            onClick={() => router.push("/projects/axie-scholar-tracker")}
          >
            CONTACT
          </button>

          <div className="wrapper__obj__bubble">{/* <GradientBubble /> */}</div>
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
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &__obj {
        width: 400px;
        height: 500px;
        border-top-left-radius: 200px;
        border-top-right-radius: 200px;
        margin-bottom: 30px;
        position: relative;
        top: 0;
        left: 0;
        transition: 1.3s;

        &::before {
          content: "";
          transition: 0.3s;
          position: absolute;
          width: 80%;
          height: 90%;

          left: 0px;
          bottom: 0px;
          z-index: -1;

          border: 1px solid transparent;
          border-radius: inherit;

          transition: 1.3s;
        }

        ${shouldShow &&
        css`
          background-color: ${isDarkMode ? "#242424" : "#eeeeee"};
          background-image: url("/herobg-md.webp");
          background-size: cover;

          /* top: -30px; */
          /* left: 30px; */

          &::before {
            left: -50px;
            bottom: -30px;
            border: 1px solid ${colors.foreground1};

            @media (max-width: 950px) {
              left: -20px;
              bottom: -15px;
            }
          }
        `}

        &__cover {
          position: absolute;

          border-top-left-radius: 200px;
          border-top-right-radius: 200px;
          height: 100%;
          width: 100%;
          overflow: hidden;

          &__animate {
            position: absolute;
            height: 100%;
            width: 0%;
            background: ${colors.foreground1};

            animation: goRight 1.4s cubic-bezier(0.65, 0.05, 0.36, 1)
              ${shouldDelay ? "1s" : ""};

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

        &__bubble {
          position: absolute;
          bottom: -120px;
          right: -80px;

          z-index: -2;
        }

        &__round-txt {
          position: absolute;
          top: 40px;
          right: -20px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;

          &::before {
            content: "";
            position: absolute;

            width: 5px;
            height: 5px;
            border-radius: 5px;
            background: ${colors.foreground1};
          }
        }

        &__title {
          font-weight: 400;
          font-size: 60px;
          position: relative;
          left: -150px;
          top: 50px;
          color: ${colors.foreground1};
          text-shadow: 10px 10px 20px ${colors.background1};

          &__line {
            overflow: hidden;
            height: 90px;

            &__txt {
              display: flex;

              display: flex;
              align-items: center;
            }
          }

          &__horiz {
            width: 50px;
            height: 3px;
            background: ${colors.accent};
            margin-right: 50px;
          }
        }

        &__desc {
          position: absolute;
          bottom: 50px;
          left: -150px;
          font-size: 16px;
          font-weight: 500;
          max-width: 350px;
          color: ${colors.foreground1};
          text-shadow: 2px 2px 10px ${colors.background1};
        }

        &__cta {
          background: ${colors.accent};
          color: #fff;
          position: absolute;

          right: -30px;
          bottom: -10px;
          padding: 12px 20px;
          border: none;

          cursor: pointer;

          font-weight: 700;

          letter-spacing: 2px;
        }

        @media (max-width: 950px) {
          width: 250px;
          height: 320px;

          &__round-txt {
            right: -25px;
            top: 25px;
            height: 80px;
            width: 80px;
          }

          &__title {
            font-size: 30px;
            left: -100px;

            &__line {
              height: 50px;
            }

            &__horiz {
              width: 30px;
              margin-right: 30px;
            }
          }

          &__desc {
            font-size: 13px;
            max-width: 250px;
            /* font-weight: 300; */
            left: -100px;
          }
        }

        @media (max-width: 568px) {
          &__title {
            left: -30px;
            font-weight: 800;
          }

          &__desc {
            font-size: 13px;
            max-width: 250px;
            left: -30px;
            bottom: 30px;
          }
        }
      }
    }
  `}
`;

export default Hero;
