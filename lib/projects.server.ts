import "server-only";

import { cache } from "react";
import {
  getProjectBySlug as fetchProjectBySlug,
  getProjectSummaries as fetchProjectSummaries,
} from "./projects";

// GraphQL uses POST, so deduplicate the validated result across metadata,
// layouts, and pages during the same server render.
export const getProjectBySlug = cache(fetchProjectBySlug);
export const getProjectSummaries = cache(fetchProjectSummaries);
export { getProjectSlugs } from "./projects";
