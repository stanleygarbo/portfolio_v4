import type { Metadata } from "next";
import Home from "../../components/home/Home";
import { getProjectSummaries } from "../../lib/projects.server";

// Cache the validated page, while each regeneration requests fresh CMS data.
export const dynamic = "force-static";
export const revalidate = 300;

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  return <Home projects={await getProjectSummaries()} />;
}
