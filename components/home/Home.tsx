"use client";

import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import About from "./About";
import HomeScrollIndicator from "./HomeScrollIndicator";
import Footer from "./Footer";
import Projects from "./Projects/Projects";
import HeroSection from "./HeroSection";
import { useTheme } from "../../contexts/themeContext";
import type { IProjectSummary } from "../../interfaces/IContentfulAPI";
interface HomeProps {
  projects: IProjectSummary[];
}

export default function Home({ projects }: HomeProps) {
  const [aboutSectionHeight, setAboutSectionHeight] = useState(0);
  const [projectsSectionHeight, setProjectsSectionHeight] = useState(0);
  const [indicators, setIndicators] = useState({
    hero: true,
    about: false,
    projects: false,
    contact: false,
  });
  const { setCustomBodyColor, setCustomAccent, setCustomForeground } =
    useTheme();

  useWindowScrollPosition(({ currPos }) => {
    const top = currPos.y;
    const bottom = top + window.innerHeight;
    const isProjectsActive =
      top >= aboutSectionHeight + 300 &&
      bottom <
        window.innerHeight + aboutSectionHeight + projectsSectionHeight + 500;

    const activeSection =
      bottom >= document.documentElement.scrollHeight - 1
        ? "contact"
        : (["contact", "projects", "about", "hero"].find((id) => {
            const section = document.getElementById(id);
            return section && section.getBoundingClientRect().top <= 1;
          }) ?? "hero");

    setIndicators({
      hero: activeSection === "hero",
      about: activeSection === "about",
      projects: activeSection === "projects",
      contact: activeSection === "contact",
    });

    if (!isProjectsActive) {
      setCustomBodyColor?.("");
      setCustomAccent?.("");
      setCustomForeground?.("");
    }
  });

  return (
    <>
      <HeroSection />
      <About setAboutSectionHeight={setAboutSectionHeight} />
      <Projects
        projects={projects}
        setProjectsSectionHeight={setProjectsSectionHeight}
      />
      <Footer />
      <HomeScrollIndicator indicators={indicators} />
    </>
  );
}
