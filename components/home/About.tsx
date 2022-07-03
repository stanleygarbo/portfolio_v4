import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";

const About: React.FC<{
  setAboutSectionHeight: (height: number) => void;
}> = ({ setAboutSectionHeight }) => {
  const { colors } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current)
      setAboutSectionHeight(containerRef.current.clientHeight);
  }, [containerRef]);

  return (
    <Container colors={colors} ref={containerRef} id="about">
      <div className="wrapper wrapper--about">
        <h2>About Me.</h2>
        <p>
          Hi! My name&apos;s Stanley, a freelance web3.0 developer. Experienced
          in building, designing and scaling high quality websites that utilizes
          web3 technology.
          <br />
          <br />
          I have built personal projects which provide specific solutions to
          specific blockchain gaming communities that had gained tremendous
          amounts of traffic. One of which had gotten to 10k daily active users.
          <br />
          <br />
          NFT Projects take a lot of effort in order to succeed. I allow my
          clients to focus on other aspects such as marketing while I&apos;ll
          handle the technicalities to aim for an optimal success rate.
        </p>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    /* background: ${colors.background1}; */
    padding: 0 150px;

    position: relative;
    z-index: 1;

    @media (max-width: 850px) {
      padding: 50px 30px;
    }

    img {
      position: absolute;
      top: 20px;
      right: 0;
      z-index: -1;
    }

    .wrapper {
      z-index: -2;
      /* height: 100vh; */
      max-width: 1000px;
      margin: 0 auto;
      padding: 100px 0;
      display: flex;
      justify-content: space-between;
      /* align-items: flex-end; */

      h2 {
        color: ${colors.foreground1};
        font-weight: 500;
        font-size: 20px;

        &::before {
          content: "02.";
          font-family: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono",
            monospace;
          font-size: 18px;
          font-weight: 500;
          color: ${colors.customAccent ? colors.customAccent : colors.accent};
          margin-right: 10px;
          transition: color 0.3s;
        }
      }
      p {
        color: ${colors.foreground1}99;
        /* padding-top: 40px; */
        max-width: 480px;
      }

      @media (max-width: 973px) {
        flex-direction: column;
        padding: 50px 0;

        h2 {
          margin-bottom: 50px;
        }

        p {
          max-width: 100%;
        }
      }
    }

    .bubble {
      bottom: 100px;
      right: 100px;

      position: absolute;
      z-index: -2;

      transform: scale(1.2);
    }
  `}
`;

export default About;
