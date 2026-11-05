import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../../contexts/themeContext";
import { IColors } from "../../../interfaces/IColors";
import type { IProjectSummary } from "../../../interfaces/IContentfulAPI";
import Project from "./Project";

const Projects: React.FC<{
  setProjectsSectionHeight: (height: number) => void;
  projects: IProjectSummary[];
}> = ({ setProjectsSectionHeight, projects }) => {
  const { colors } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => setProjectsSectionHeight(container.clientHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, [setProjectsSectionHeight]);

  return (
    <Container $colors={colors} ref={containerRef} id="projects">
      <div className="wrapper">
        <h2>Projects.</h2>
        <div className="wrapper__projects">
          {projects.map((i) => (
            <Project
              key={i.slug}
              title={i.previewTitle}
              description={i.previewDescription}
              img={i.banner.url}
              imageWidth={i.banner.width}
              imageHeight={i.banner.height}
              roundTxt={i.roundText}
              webVer={i.webNumber}
              slug={i.slug}
              customColors={{
                background: i.theme.background,
                accent: i.theme.accent,
                foreground: i.theme.foreground,
                accentForeground: i.theme.accentForeground,
              }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ $colors: IColors }>`
  ${({ $colors: colors }) => css`
    position: relative;
    width: 100%;
    z-index: 1;
    padding: 50px 150px;
    @media (max-width: 850px) {
      padding: 50px 30px;
    }

    .wrapper {
      z-index: -2;
      min-height: 200vh;
      max-width: 1000px;
      margin: 0 auto;
      /* backdrop-filter: blur(105px); */
      background-blend-mode: overlay;

      &__projects {
        width: 100%;
        margin-top: 50px;

        display: flex;
        flex-direction: column;
        gap: 100px;
      }

      h2 {
        color: ${colors.foreground1};
        font-weight: 500;
        font-size: 20px;

        &::before {
          content: "03.";
          font-family:
            "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace;
          font-size: 18px;
          font-weight: 500;
          color: ${colors.customAccent ? colors.customAccent : colors.accent};
          margin-right: 10px;
          transition: color 0.3s;
        }
      }
    }
  `}
`;

export default Projects;
