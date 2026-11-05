import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Layout from "../../../components/Layout";
import { getProjectBySlug } from "../../../lib/projects.server";

export const dynamic = "force-static";
export const revalidate = 300;

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return <Layout pageTheme={project.theme}>{children}</Layout>;
}
