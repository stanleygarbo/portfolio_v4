"use client";

import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import About from "./About";
import HomeScrollIndicator from "./HomeScrollIndicator";
import Footer from "./Footer";
import Projects from "./Projects/Projects";
import HeroSection from "./HeroSection";
import type { IProjectSummary } from "../../interfaces/IContentfulAPI";
interface HomeProps {
  projects: IProjectSummary[];
}

export default function Home({ projects }: HomeProps) {
  const [indicators, setIndicators] = useState({
    hero: true,
    about: false,
    projects: false,
    contact: false,
  });
  useWindowScrollPosition(({ currPos }) => {
    const top = currPos.y;
    const bottom = top + window.innerHeight;
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
  });

  return (
    <>
      <HeroSection />
      <About />
      <Projects projects={projects} />
      <Footer />
      <HomeScrollIndicator indicators={indicators} />
    </>
  );
}
