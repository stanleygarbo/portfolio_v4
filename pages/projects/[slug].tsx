import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import CaseContent from "../../components/project/CaseContent";
import ProjectPreview from "../../components/project/ProjectPreview";
import { useTheme } from "../../contexts/themeContext";
import {
  IProjectCollection,
  ISingleProjectItem,
} from "../../interfaces/IContentfulAPI";
import { fetchGraphQL } from "../../lib/contentfulAPI";
import { wait } from "../../util/wait";
import cache from "memory-cache";
import Footer from "../../components/home/Footer";

interface IPage extends ISingleProjectItem {
  isPageFound: boolean;
}

const Slug: NextPage<IPage> = (props) => {
  const {
    setCustomBodyColor,
    setCustomAccent,
    setCustomForeground,
    setCustomAccentForeground,
  } = useTheme();

  const p = {
    accent: props.theme.accent,
    background: props.theme.background,
    foreground: props.theme.foreground,
    accentForeground: props.theme.accentForeground,
  };

  useEffect(() => {
    if (
      setCustomBodyColor &&
      setCustomAccent &&
      setCustomForeground &&
      setCustomAccentForeground
    ) {
      setCustomBodyColor(p.background);
      setCustomAccent(p.accent);
      setCustomForeground(p.foreground);
      setCustomAccentForeground(p.accentForeground);
    }

    return () => {
      if (
        setCustomBodyColor &&
        setCustomAccent &&
        setCustomForeground &&
        setCustomAccentForeground
      ) {
        setCustomBodyColor("");
        setCustomAccent("");
        setCustomForeground("");
        setCustomAccentForeground("");
      }
    };
  }, []);
  console.log(props);
  return (
    <>
      <Head>
        <title>
          {props.title} | Stanley Garbo | A developer&apos;s portfolio
        </title>
        <meta name="description" content={props.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProjectPreview
        demoUrl={props.demoUrl}
        liveUrl={props.liveUrl}
        title={props.title}
        description={props.description}
        date={props.date}
        location={props.location}
        bannerURL="https://res.cloudinary.com/dr4q1cnig/image/upload/v1631085226/portfolio%20images/am1_frijyr.png"
        technologies={props.technologies}
        product={props.product}
      />
      {props.content?.caseContent?.map((i, idx) => (
        <CaseContent
          key={idx}
          headlineNumber={i.headlineNumber}
          headlineText={i.headlineText}
          paragraph1={i.paragraph1}
          paragraph2={i.paragraph2}
          paragraph3={i.paragraph3}
          img={i.img}
          title={i.title}
        />
      ))}

      <Footer />
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const pathname = "/" + ctx.req.headers.referer?.split("/").reverse()[0];
  const slug = ctx.params?.slug;

  if (slug) {
    const c = cache.get(slug);
    if (c) {
      if (pathname) {
        await wait(500);
      }

      return c;
    }

    const query = `
      query getProject($slug: String!){
        projectCollection(where:{slug:$slug}){
          items{
            slug
            title
            description
            location
            date
            technologies
            product
            content
            theme
            demoUrl
            liveUrl
          }
        }
      }
    `;

    const res: IProjectCollection = await fetchGraphQL({
      query,
      variables: {
        slug,
      },
    });

    if (!res.data || res.data.projectCollection.items.length < 1) {
      if (pathname) {
        await wait(500);
      }

      return {
        redirect: {
          permanent: false,
          destination: "/page-not-found",
        },
        props: { isPageFound: false }, // will be passed to the page component as props
      };
    }

    const data = {
      props: { isPageFound: true, ...res.data.projectCollection.items[0] },
    };

    cache.put(slug, data, 5 * 1000 * 60 * 60);

    if (pathname) {
      await wait(500);
    }

    return data;
  }

  if (pathname) {
    await wait(500);
  }

  return {
    redirect: {
      permanent: false,
      destination: "/page-not-found",
    },
    props: { isPageFound: false }, // will be passed to the page component as props
  };
}
export default Slug;
