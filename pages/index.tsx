import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useWindowScrollPosition } from "@n8tb1t/use-scroll-position";
import About from "../components/home/About";
import HomeScrollIndicator from "../components/home/HomeScrollIndicator";
import Footer from "../components/home/Footer";
import Projects from "../components/home/Projects/Projects";
import HeroSection from "../components/home/HeroSection";
import { useTheme } from "../contexts/themeContext";
import type { IProjectSummary } from "../interfaces/IContentfulAPI";
import {
  getProjectSummaries,
  PROJECT_REVALIDATE_SECONDS,
} from "../lib/projects";

interface HomeProps {
  projects: IProjectSummary[];
}

const Home: NextPage<HomeProps> = ({ projects }) => {
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

    setIndicators({
      hero: top <= 0,
      about: top > 0 && bottom < window.innerHeight + aboutSectionHeight + 300,
      projects: isProjectsActive,
      contact:
        top > 0 &&
        bottom >
          window.innerHeight + aboutSectionHeight + projectsSectionHeight + 500,
    });

    if (!isProjectsActive) {
      setCustomBodyColor?.("");
      setCustomAccent?.("");
      setCustomForeground?.("");
    }
  });

  return (
    <>
      <Head>
        <title>Stanley Garbo | A software developer&apos;s portfolio</title>
        <meta
          name="description"
          content="Experienced in building, designing and scaling high quality web applications that utilize both web 2.0 and web 3.0 technologies."
        />
        <link rel="canonical" href="https://stanleygarbo.com/" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="Stanley Garbo | A Software Developer's portfolio"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://stanleygarbo.com/portfolio_.png"
        />
      </Head>
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
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => ({
  props: { projects: await getProjectSummaries() },
  revalidate: PROJECT_REVALIDATE_SECONDS,
});

export default Home;
