import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseContent from "../../../components/project/CaseContent";
import ProjectPreview from "../../../components/project/ProjectPreview";
import Footer from "../../../components/home/Footer";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "../../../lib/projects.server";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      title: project.title,
      description: project.description,
      url: `/projects/${project.slug}`,
      images: ["/portfolio_.png"],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectPreview
        demoUrl={project.demoUrl}
        liveUrl={project.liveUrl}
        title={project.title}
        description={project.description}
        date={project.date}
        location={project.location}
        technologies={project.technologies}
        product={project.product}
      />
      {project.content?.caseContent?.map((content, index) => (
        <CaseContent key={index} {...content} />
      ))}
      <Footer />
    </>
  );
}
