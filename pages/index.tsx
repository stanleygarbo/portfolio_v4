import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import About from "../components/home/About";
import HomeScrollIndicator from "../components/home/HomeScrollIndicator";
import { wait } from "../util/wait";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useTheme } from "../contexts/themeContext";
import Footer from "../components/home/Footer";
import Projects from "../components/home/Projects/Projects";
import { fetchGraphQL } from "../lib/contentfulAPI";
import {
  IProjectCollection,
  ISingleProjectItem,
} from "../interfaces/IContentfulAPI";
import cache from "memory-cache";
import HeroSection from "../components/home/HeroSection";

const Home: NextPage<{
  shouldDelay: boolean;
  projects: ISingleProjectItem[];
  hasBeenAccessedBefore: boolean;
}> = ({ shouldDelay, projects, hasBeenAccessedBefore }) => {
  const [aboutSectionHeight, setAboutSectionHeight] = useState<number>(0);
  const [ProjectsSectionHeight, setProjectsSectionHeight] = useState<number>(0);

  const [isWindowLoaded, setIsWindowLoaded] = useState(hasBeenAccessedBefore);

  const { setCustomBodyColor, setCustomAccent, setCustomForeground } =
    useTheme();

  const [isHeroActive, setIsHeroActive] = useState(true);
  const [isAboutActive, setIsAboutActive] = useState(false);
  const [isProjectsActive, setIsProjectsActive] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);

  useScrollPosition(({ currPos }) => {
    const bottomOfScreen = -currPos.y + window.innerHeight;

    if (bottomOfScreen >= 0 && bottomOfScreen <= window.innerHeight) {
      setIsHeroActive(true);
    } else {
      setIsHeroActive(false);
    }

    if (
      bottomOfScreen - window.innerHeight > 0 &&
      bottomOfScreen < window.innerHeight + aboutSectionHeight + 300
    ) {
      setIsAboutActive(true);
    } else {
      setIsAboutActive(false);
    }

    if (
      bottomOfScreen - window.innerHeight >= aboutSectionHeight + 300 &&
      bottomOfScreen <
        window.innerHeight + aboutSectionHeight + ProjectsSectionHeight + 500
    ) {
      setIsProjectsActive(true);
    } else {
      setIsProjectsActive(false);

      if (setCustomBodyColor && setCustomAccent && setCustomForeground) {
        setCustomBodyColor("");
        setCustomAccent("");
        setCustomForeground("");
      }
    }
    if (
      bottomOfScreen - window.innerHeight > 0 &&
      bottomOfScreen >
        window.innerHeight + aboutSectionHeight + ProjectsSectionHeight + 500
    ) {
      setIsContactActive(true);
    } else {
      setIsContactActive(false);
    }
  });

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted && !hasBeenAccessedBefore) setIsWindowLoaded(true);
    }, 2000);

    return () => {
      isMounted = false;
    };
  }, [hasBeenAccessedBefore]);

  return (
    <>
      <Head>
        <title>Stanley Garbo | A software developer&apos;s portfolio</title>
        <meta
          name="description"
          content="Experienced
          in building, designing and scaling high quality web applications that utilizes both
          web 2.0 and web 3.0 technologies."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="Stanley Garbo | A Software Developer's portfolio"
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/portfolio_.png" />
      </Head>
      {/* <ScrollContainer id="my-scrollbar" onScroll={handleScroll}> */}
      {/* <Hero shouldDelay={shouldDelay} isWindowLoaded={isWindowLoaded} /> */}
      <HeroSection shouldDelay={shouldDelay} isWindowLoaded={isWindowLoaded} />
      <About setAboutSectionHeight={setAboutSectionHeight} />
      <Projects
        projects={projects}
        setProjectsSectionHeight={setProjectsSectionHeight}
      />
      <Footer />
      {/* </ScrollContainer> */}
      <HomeScrollIndicator
        indicators={{
          hero: isHeroActive,
          about: isAboutActive,
          projects: isProjectsActive,
          contact: isContactActive,
        }}
      />
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const referrer = ctx.req.headers.referer?.split("/").reverse()[0];
  const c = cache.get(`ALL_PROJECTS`);

  if (c) {
    if (referrer !== undefined) {
      await wait(500);
    }

    return {
      props: {
        hasBeenAccessedBefore: !!referrer,
        shouldDelay: !!referrer,
        ...c,
      },
    };
  } else {
    const query = `
    query {
      projectCollection{
        items{
          slug
          previewTitle
          previewDescription
          roundText
          webNumber
          banner{
            url
          }
          theme
          projectNumber
        }
      }
    }
  `;

    const res: IProjectCollection = await fetchGraphQL({ query });
    const projects: ISingleProjectItem[] = [];

    res.data.projectCollection.items.map((i) => {
      projects.push(i);
    });

    projects.sort((a: any, b: any) => a.projectNumber - b.projectNumber);

    const data = {
      projects,
    };

    cache.put(`ALL_PROJECTS`, data, 5 * 1000 * 60 * 60);

    if (!!referrer) {
      await wait(500);
    }

    return {
      props: {
        hasBeenAccessedBefore: !!referrer,
        shouldDelay: !!referrer,

        ...data,
      },
    };
  }
}

export default Home;
