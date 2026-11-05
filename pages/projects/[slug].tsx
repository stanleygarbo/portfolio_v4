import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import CaseContent from "../../components/project/CaseContent";
import ProjectPreview from "../../components/project/ProjectPreview";
import type { ISingleProjectItem } from "../../interfaces/IContentfulAPI";
import {
  getProjectBySlug,
  getProjectSlugs,
  PROJECT_REVALIDATE_SECONDS,
} from "../../lib/projects";
import Footer from "../../components/home/Footer";

const Slug: NextPage<ISingleProjectItem> = (props) => {
  return (
    <>
      <Head>
        <title>{`${props.title} | Stanley Garbo | A developer's portfolio`}</title>
        <meta name="description" content={props.description} />
        <link
          rel="canonical"
          href={`https://stanleygarbo.com/projects/${props.slug}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProjectPreview
        demoUrl={props.demoUrl}
        liveUrl={props.liveUrl}
        title={props.title}
        description={props.description}
        date={props.date}
        location={props.location}
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjectSlugs()).map(({ slug }) => ({ params: { slug } })),
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<
  ISingleProjectItem,
  { slug: string }
> = async ({ params }) => {
  if (!params?.slug) return { notFound: true };

  const project = await getProjectBySlug(params.slug);

  if (!project)
    return { notFound: true, revalidate: PROJECT_REVALIDATE_SECONDS };

  return { props: project, revalidate: PROJECT_REVALIDATE_SECONDS };
};

export default Slug;
