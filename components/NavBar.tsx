import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { FiLinkedin, FiGithub } from "react-icons/fi";

const NavBar: React.FC = () => {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const aniStart = () => {
    setIsActive(true);
  };
  const aniEnd = () => {
    setTimeout(() => {
      setIsActive(false);
    }, 100);
  };
  useEffect(() => {
    router.events.on("routeChangeStart", aniStart);
    router.events.on("routeChangeComplete", aniEnd);
    router.events.on("routeChangeError", aniEnd);

    return () => {
      router.events.off("routeChangeStart", aniStart);
      router.events.off("routeChangeComplete", aniEnd);
      router.events.off("routeChangeError", aniEnd);
    };
  }, [router]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const onClickHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Container colors={colors} isActive={isActive}>
      <div className="cover">
        <i className="cover__text">Loading...</i>
      </div>
      <div className="wrapper">
        <Link href="/" passHref>
          <a className="wrapper__logo">SG</a>
        </Link>
        <div className="wrapper__right">
          <a className="resume" href="/StanleyGarboResume.pdf" target="blank">
            Resume
          </a>
          <button
            className={`hamburger-menu  ${
              isMenuOpen && "hamburger-menu--open"
            }`}
            onClick={onClickHandler}
          >
            <div className="line line-1"></div>
            <div className="line line-2"></div>
          </button>
        </div>
      </div>
      <div className={`menu-cont`}>
        <div
          onClick={onClickHandler}
          className={`menu-cont__backdrop ${
            isMenuOpen && "menu-cont__backdrop--open"
          }`}
        ></div>
        <div
          className={`menu-cont__links ${
            isMenuOpen && "menu-cont__links--open"
          }`}
        >
          <ul>
            <li>
              <Link href="#hero">
                <a onClick={onClickHandler}>
                  <span>01 </span>
                  Hero
                </a>
              </Link>
            </li>
            <li>
              <Link href="#about">
                <a onClick={onClickHandler}>
                  <span>02 </span>
                  About
                </a>
              </Link>
            </li>
            <li>
              <Link href="#projects">
                <a onClick={onClickHandler}>
                  <span>03 </span>
                  Projects
                </a>
              </Link>
            </li>
            <li>
              <Link href="#contact">
                <a onClick={onClickHandler}>
                  <span>04 </span>
                  Contact
                </a>
              </Link>
            </li>
          </ul>

          <div className="menu-cont__links__ext">
            <a
              className="menu-cont__links__ext__resume"
              href="/StanleyGarboResume.pdf"
              target="blank"
            >
              Resume
            </a>
            <a
              className="menu-cont__links__ext__resume"
              href="/StanleyGarboResume.pdf"
              target="blank"
            >
              <FiGithub size={23} />
            </a>
            <a
              className="menu-cont__links__ext__resume"
              href="/StanleyGarboResume.pdf"
              target="blank"
            >
              <FiLinkedin size={23} />
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.nav<{ colors: IColors; isActive: boolean }>`
  ${({ colors, isActive }) => css`
    z-index: 15;
    position: fixed;
    top: 0;
    width: 100%;

    .resume,
    .menu-cont__links__ext__resume {
      border: 1px solid
        ${colors.customAccent ? colors.customAccent : colors.accent};
      color: ${colors.customAccent ? colors.customAccent : colors.accent};
      text-decoration: none;
      border-radius: 5px;
      display: flex;
      align-items: center;
      transition: 0.3s;

      &:hover {
        background: ${colors.customAccent
          ? colors.customAccent
          : colors.accent}30;
      }
    }

    .resume {
      align-self: start;
      margin-left: 40px;
      padding: 10px 40px;

      @media (max-width: 850px) {
        display: none;
      }
    }

    .menu-cont {
      &__links,
      &__backdrop {
        position: absolute;
        width: 0%;
        height: 100vh;
        top: 0;
        right: 0;
        transition: 0.7s;
        transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
      }

      &__links {
        background: ${colors.customBodyColor
          ? colors.customBodyColor
          : colors.background1};
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background: #ffffff10;
          pointer-events: none;
        }

        ul {
          display: flex;
          flex-direction: column;
          list-style-type: none;
          padding-left: 40px;

          text-transform: uppercase;
          padding-bottom: 50px;

          li {
            a {
              text-decoration: none;
              font-size: 35px;
              white-space: nowrap;

              span {
                font-family: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono",
                  monospace;
                font-size: 18px;
                font-weight: 500;
                color: ${colors.customAccent
                  ? colors.customAccent
                  : colors.accent};
                margin-right: 10px;
              }
            }
          }
        }

        &--open {
          width: 360px;

          @media (max-width: 400px) {
            width: 100%;
          }
        }

        &__ext {
          display: flex;

          &__resume {
            align-self: unset;
            margin-left: 10px;
            padding: 10px 12px;

            &:nth-child(1) {
              padding: 10px 40px;
              margin-left: 40px;
            }
          }
        }
      }

      &__backdrop {
        &--open {
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
        }
      }
    }

    .cover {
      background-color: ${colors.background2};
      border-bottom: 2px solid #333;
      border-top: 2px solid #333;
      width: 100%;
      height: 0%;
      position: fixed;
      bottom: 0;

      z-index: 500;

      transition: height 0.7s;
      transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
      display: flex;
      align-items: center;
      justify-content: center;

      ${isActive
        ? css`
            height: 100%;
          `
        : css`
            height: 0%;
            top: -4px;
          `}

      &__text {
        color: #fff;
        opacity: 0;
        transition: opacity 0.5s;
        transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
        font-size: 20px;

        ${isActive &&
        css`
          opacity: 1;
        `}
      }
    }

    .wrapper {
      width: 100%;

      a {
      }

      &__right {
        display: flex;
        align-items: center;
        gap: 50px;
      }

      @media (max-width: 500px) {
        padding: 15px 30px;
      }

      /* max-width: 1200px; */
      padding: 30px 50px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__logo {
        font-weight: 800;
        font-size: 30px;

        text-decoration: none;

        color: ${colors.customAccent
          ? colors.customAccent
          : colors.foreground1};
      }

      .hamburger-menu {
        display: flex;
        flex-direction: column;
        height: 50px;
        width: 50px;
        justify-content: center;
        align-items: flex-end;
        background: none;
        border: none;
        padding: 10px;
        border-radius: 100%;
        cursor: pointer;

        z-index: 200;

        .line {
          height: 2px;
          width: 23px;
          background: ${colors.customAccent
            ? colors.customAccent
            : colors.foreground1};
          border-radius: 20px;

          transition: 0.5s;

          &-1 {
            width: 33px;
            margin-bottom: 6px;
          }
        }

        &--open {
          .line-1 {
            transform: rotate(405deg) translate(3px, 1px);
          }
          .line-2 {
            transform: rotate(315deg) translate(4px, -2px);
            width: 33px;
          }
        }
      }
    }
  `}
`;

export default NavBar;
