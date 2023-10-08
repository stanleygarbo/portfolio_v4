import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { IProjectPreview } from "../../interfaces/project/IProjectPreview";
import { BsArrowUpRight } from "react-icons/bs";

const ProjectPreview: React.FC<IProjectPreview> = ({
  title,
  description,
  date,
  location,
  technologies,
  product,
  demoUrl,
  liveUrl,
}) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="inner">
        <h1>{title}</h1>
        <p>{description}</p>
        {demoUrl && (
          <a href={demoUrl} rel="noreferrer" target="_blank">
            View Demo&nbsp; <BsArrowUpRight />
          </a>
        )}
        {liveUrl && (
          <a href={liveUrl} rel="noreferrer" target="_blank">
            View Live&nbsp; <BsArrowUpRight />
          </a>
        )}
      </div>
      <div className="metas">
        <div className="metas__item">
          <h2>Location</h2>
          <p>{location}</p>
        </div>
        <div className="metas__item">
          <h2>Date</h2>
          <p>{date}</p>
        </div>

        <div className="metas__item">
          <h2>Technologies</h2>
          <p>{technologies}</p>
        </div>

        <div className="metas__item">
          <h2>Product</h2>
          <p>{product}</p>
        </div>
      </div>
      {/* <img src={"/axie.png"} alt="" width="100%" /> */}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1300px;
    margin: 45px auto;
    padding: 0 150px;
    padding-bottom: 45px;

    .inner {
      margin-left: auto;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      align-items: start;

      h1 {
        font-size: 17px;
        color: ${colors.customAccent
          ? colors.customAccent
          : colors.foreground1};
      }

      p {
        margin-top: 80px;
        font-size: 25px;
        font-weight: 300;
        color: ${colors.customForeground
          ? colors.customForeground
          : colors.foreground1};
        margin-bottom: 30px;
      }

      a {
        color: ${colors.foreground1};
        position: relative;
        display: flex;
        align-items: center;
        text-decoration: none;

        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 1px;
          background: ${colors.foreground1};
          bottom: 0;
        }
      }
    }

    .metas {
      display: flex;
      justify-content: space-between;
      margin-top: 70px;
      flex-wrap: wrap;
      gap: 30px;

      h2 {
        font-size: 17px;
        color: ${(colors.customForeground
          ? colors.customForeground
          : colors.foreground1) + "cc"};
      }

      p {
        color: ${(colors.customForeground
          ? colors.customForeground
          : colors.foreground1) + 99};
        font-size: 15px;
      }
      &__item {
        font-size: 17px;
        width: 200px;
      }
    }

    img {
      margin: 70px 0;
      /* border-radius: 10px; */

      box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 855px) {
      margin-top: 140px;
    }

    @media (max-width: 800px) {
      padding: 0 50px;

      .inner {
        margin-left: unset;
      }
    }

    @media (max-width: 500px) {
      padding: 0 30px;
    }
  `}
`;

export default ProjectPreview;
