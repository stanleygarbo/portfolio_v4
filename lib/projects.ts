import type {
  IProjectCollection,
  IProjectSummary,
  ISingleProjectItem,
} from "../interfaces/IContentfulAPI.ts";
import { fetchGraphQL } from "./contentfulAPI.ts";

export const PROJECT_REVALIDATE_SECONDS = 300;

async function fetchProjects<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T[]> {
  const data = await fetchGraphQL<IProjectCollection<T>>({ query, variables });

  if (!Array.isArray(data.projectCollection?.items)) {
    throw new Error("Contentful returned an invalid project collection.");
  }

  return data.projectCollection.items.filter((item) => item !== null);
}

export function getProjectSummaries() {
  return fetchProjects<IProjectSummary>(`
    query {
      projectCollection(limit: 100, order: projectNumber_ASC) {
        items {
          slug
          previewTitle
          previewDescription
          roundText
          webNumber
          banner { url width height }
          theme
          projectNumber
        }
      }
    }
  `);
}

export function getProjectSlugs() {
  return fetchProjects<{ slug: string }>(`
    query {
      projectCollection(limit: 100) {
        items { slug }
      }
    }
  `);
}

export async function getProjectBySlug(slug: string) {
  const projects = await fetchProjects<ISingleProjectItem>(
    `query getProject($slug: String!) {
      projectCollection(where: { slug: $slug }, limit: 1) {
        items {
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
    }`,
    { slug },
  );

  return projects[0] ?? null;
}
