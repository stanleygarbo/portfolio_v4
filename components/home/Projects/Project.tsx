import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../../contexts/themeContext";
import { IProject } from "../../../interfaces/Home/IProject";
import { IColors } from "../../../interfaces/IColors";
import ButtonLink from "../../ButtonLink";
import ContentBox from "../../ContentBox";
import RoundText from "../../RoundText";

const Project: React.FC<IProject> = ({
  title,
  description,
  img,
  roundTxt,
  webVer,
  customColors,
  customBackground,
  slug,
}) => {
  const { colors } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [showImg, setShowImg] = useState(false);
  const [hideImg, setHideImg] = useState(true);
  const {
    setCustomBodyColor,
    setCustomAccent,
    setCustomForeground,
    setCustomAccentForeground,
  } = useTheme();
  const router = useRouter();

  useScrollPosition(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();

      // check if object is in viewport
      if (rect.top - (window.innerHeight - 200) < 0) {
        setShowImg(true);
        setTimeout(() => {
          setHideImg(false);
        }, 700);
      }
      if (
        setCustomBodyColor &&
        setCustomAccent &&
        setCustomForeground &&
        setCustomAccentForeground
      ) {
        if (rect.top - (window.innerHeight - 100) < 0 && rect.top + 300 > 0) {
          setCustomBodyColor(customColors.background);
          setCustomAccent(customColors.accent);
          setCustomForeground(customColors.foreground);
          setCustomAccentForeground(customColors.accentForeground);
        }
      }
    }
  }, [ref, customBackground]);

  return (
    <Container colors={colors}>
      <div className="text-group">
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        <span>{webVer}</span>
      </div>
      <div className="project-img" ref={ref}>
        <div
          className={`project-img__cover ${
            showImg ? "project-img__cover--show" : ""
          }`}
        ></div>
        {hideImg && <div className="project-img__cover-bg"></div>}
        <Link href={`/projects/${slug}`}>
          <img
            src={img}
            alt=""
            className={`project-img__${!hideImg && "shown"}`}
          />
        </Link>
        <div className="project-img__round-txt-cont">
          <RoundText text={roundTxt} letterSpacing={5} />
        </div>
      </div>
      <p>{description}</p>
      <ContentBox
        onClick={() => {
          router.push(`/projects/${slug}`);
        }}
        backgroundColor={
          colors.customForeground ? colors.customForeground : colors.foreground1
        }
      >
        <ButtonLink text="Learn More" href={`/projects/${slug}`} />
      </ContentBox>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .text-group {
      width: 100%;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      z-index: 3;

      span {
        color: ${colors.customForeground
          ? colors.customForeground
          : colors.foreground1};
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 12px;
        padding-top: 10px;
        white-space: nowrap;
      }

      h3 {
        color: ${colors.customForeground
          ? colors.customForeground
          : colors.foreground1};
        line-height: 65px;

        font-size: 50px;

        @media (max-width: 950px) {
          font-size: 40px;
        }

        @media (max-width: 450px) {
          font-size: 30px;
          line-height: 45px;
        }
      }
    }

    .project-img {
      width: 80%;
      align-self: flex-end;
      top: -40px;
      position: relative;
      height: fit-content;

      &__cover-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: ${colors.customBodyColor
          ? colors.customBodyColor
          : colors.background1};

        transition: background-color 0.3s;
      }

      &__cover {
        position: absolute;
        width: 0%;
        height: 100%;
        background: ${colors.customAccent
          ? colors.customAccent
          : colors.accent};
        z-index: 2;

        &--show {
          animation: goRight 1.4s cubic-bezier(0.65, 0.05, 0.36, 1);

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

      img {
        width: 100%;
        cursor: pointer;
      }

      &__shown {
        box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.3);
      }

      &__round-txt-cont {
        width: 200px;
        position: absolute;
        bottom: -90px;
        left: -96px;
        pointer-events: none;

        animation: rotation 60s linear infinite;
        z-index: 3;

        @media (max-width: 850px) {
          width: 100px;
          height: 100px;
          bottom: -40px;
          left: -56px;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
      }
    }

    p {
      color: ${colors.customForeground
        ? colors.customForeground
        : colors.foreground1 + 99};
      margin-top: 100px;
      margin-bottom: 50px;
      max-width: 700px;
      @media (max-width: 850px) {
        margin-top: 50px;
      }
    }
  `}
`;

export default Project;
