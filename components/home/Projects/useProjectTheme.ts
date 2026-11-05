"use client";

import { useEffect, type RefObject } from "react";
import { useTheme } from "../../../contexts/themeContext";
import type { IProjectSummary } from "../../../interfaces/IContentfulAPI";
import { getActiveProjectIndex } from "../../../lib/projectViewport";

export function useProjectTheme(
  containerRef: RefObject<HTMLDivElement | null>,
  projects: readonly IProjectSummary[],
) {
  const { setProjectTheme } = useTheme();

  // Clear on unmount, while preserving the palette when CMS props refresh.
  useEffect(() => () => setProjectTheme(null), [setProjectTheme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-project-slug]"),
    );
    const themes = new Map(
      projects.map((project) => [project.slug, project.theme]),
    );
    let activeSlug: string | null | undefined;
    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      const index = getActiveProjectIndex(
        cards.map((card) => card.getBoundingClientRect()),
        {
          viewportHeight: window.innerHeight,
          atPageEnd:
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 1,
        },
      );
      const slug =
        index === null ? null : (cards[index].dataset.projectSlug ?? null);

      if (slug !== activeSlug) {
        activeSlug = slug;
        setProjectTheme(slug === null ? null : (themes.get(slug) ?? null));
      }
    };

    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(container);
    cards.forEach((card) => observer.observe(card));
    const main = document.getElementById("main");
    if (main) observer.observe(main);

    scheduleUpdate();

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, [containerRef, projects, setProjectTheme]);
}
