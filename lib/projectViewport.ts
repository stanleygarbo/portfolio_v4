export interface ProjectBounds {
  top: number;
  bottom: number;
}

export function getActiveProjectIndex(
  projects: readonly ProjectBounds[],
  { viewportHeight, atPageEnd }: { viewportHeight: number; atPageEnd: boolean },
): number | null {
  if (projects.length === 0 || viewportHeight <= 0 || atPageEnd) return null;

  const focus = viewportHeight / 2;
  if (
    focus < projects[0].top ||
    focus >= projects[projects.length - 1].bottom
  ) {
    return null;
  }

  for (let index = 0; index < projects.length; index++) {
    const next = projects[index + 1];
    // Share the gap between adjacent cards, so the theme never flashes back
    // to the default palette while scrolling between projects.
    const boundary = next
      ? (projects[index].bottom + next.top) / 2
      : projects[index].bottom;
    if (focus < boundary) return index;
  }

  return null;
}
