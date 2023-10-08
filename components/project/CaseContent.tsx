import Image from "next/image";
import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { ICaseContent } from "../../interfaces/project/ICaseContent";

const CaseContent: React.FC<ICaseContent> = ({
  headlineNumber,
  headlineText,
  paragraph1,
  paragraph2,
  paragraph3,
  img,
}) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      {!!img && (
        <div className="img-cont">
          <Image
            src={img.url}
            placeholder="blur"
            blurDataURL={img.url}
            objectFit="contain"
            width={img.width}
            height={img.height}
          />
        </div>
      )}

      <div className="case-text">
        <div className="case-text__column case-text__column--headline">
          <p>
            <span>{headlineNumber}</span> {headlineText}
          </p>
        </div>
        <div className="case-text__column case-text__column--tagline">
          <p>{paragraph1}</p>
          <br />
          {paragraph2 && <p>{paragraph2}</p>}
          {paragraph3 && <p>{paragraph3}</p>}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1300px;
    margin: 45px auto;
    position: relative;

    padding: 0 150px;

    @media (max-width: 800px) {
      padding: 0 50px;
    }

    @media (max-width: 500px) {
      padding: 0 30px;
    }

    .img-cont {
      width: 100%;
      position: relative;
      padding-top: 5px;
      padding-bottom: 50px;

      /* position: relative; */
      /* min-height: 650px; */

      span {
        overflow: unset !important;
        img {
          box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .case-text {
      display: flex;

      &__column {
        &--headline {
          text-transform: uppercase;
          margin-top: 10px;
          p {
            font-family: Gilroy, Helvetica, Arial, sans-serif;
            letter-spacing: 3px;
            font-size: 12px;
            color: ${colors.customForeground
              ? colors.customForeground
              : colors.foreground1};

            span {
              margin-right: 10px;

              color: ${colors.customAccent
                ? colors.customAccent
                : colors.foreground1};
            }
          }
        }
        &--tagline {
          max-width: 600px;
          margin-left: auto;

          font-weight: 300;
          line-height: 35px;
          font-size: 17px;
          color: ${(colors.customForeground
            ? colors.customForeground
            : colors.foreground1) + 99};
        }
      }

      @media (max-width: 1185px) {
        flex-direction: column;

        &__column {
          &--tagline {
            margin-left: unset;
            max-width: 100%;
            margin-top: 20px;
          }
        }
      }
    }
  `}
`;

export default CaseContent;
