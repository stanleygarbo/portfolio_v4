"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import { GlobalVars } from "../GlobalVars";

const NavBar: React.FC = () => {
  const { colors } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const onClickHandler = () => {
    setIsMenuOpen((previous) => !previous);
  };

  return (
    <Container $colors={colors}>
      <div className="wrapper">
        <Link
          href="/"
          className="wrapper__logo"
          aria-label="Stanley Garbo home"
        >
          SG
        </Link>
        <div className="wrapper__right">
          <a
            className="resume"
            href="/StanleyGarboResume.pdf"
            rel="noreferrer"
            target="_blank"
          >
            Resume
          </a>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
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
          id="navigation-menu"
          inert={!isMenuOpen}
          className={`menu-cont__links ${
            isMenuOpen && "menu-cont__links--open"
          }`}
        >
          <ul>
            <li>
              <Link href="/#hero" onClick={onClickHandler}>
                <span>01 </span>
                Hero
              </Link>
            </li>
            <li>
              <Link href="/#about" onClick={onClickHandler}>
                <span>02 </span>
                About
              </Link>
            </li>
            <li>
              <Link href="/#projects" onClick={onClickHandler}>
                <span>03 </span>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/#contact" onClick={onClickHandler}>
                <span>04 </span>
                Contact
              </Link>
            </li>
          </ul>

          <div className="menu-cont__links__ext">
            <a
              className="menu-cont__links__ext__resume"
              href="/StanleyGarboResume.pdf"
              rel="noreferrer"
              target="_blank"
            >
              Resume
            </a>
            <a
              className="menu-cont__links__ext__social"
              aria-label="GitHub"
              href={GlobalVars.githubURL}
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub size={23} />
            </a>
            <a
              className="menu-cont__links__ext__social"
              aria-label="LinkedIn"
              href={GlobalVars.linkedInURL}
              target="_blank"
              rel="noreferrer"
            >
              <FiLinkedin size={23} />
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.nav<{ $colors: IColors }>`
  ${({ $colors: colors }) => css`
    z-index: 15;
    position: fixed;
    top: 0;
    width: 100%;

    .resume,
    .menu-cont__links__ext__resume,
    .menu-cont__links__ext__social {
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
                font-family:
                  "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace;
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
            padding: 10px 40px;
            margin-left: 40px;
          }

          &__social {
            align-self: unset;
            margin-left: 10px;
            padding: 10px 12px;
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
