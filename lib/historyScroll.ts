interface ScrollPosition {
  x: number;
  y: number;
}

interface BrowserNavigation extends EventTarget {
  currentEntry: { key: string } | null;
}

export interface HistoryScrollController {
  commit: () => void;
  prepareRestoration: () => () => void;
  dispose: () => void;
}

export function manageHistoryScroll(
  getRenderedRoute: () => string | null,
): HistoryScrollController | null {
  const navigation = (window as Window & { navigation?: BrowserNavigation })
    .navigation;
  if (!navigation?.currentEntry) return null;

  const positions = new Map<string, ScrollPosition>();
  let renderedKey = navigation.currentEntry.key;
  let historyKey = renderedKey;
  let frame: number | undefined;
  const previousRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";

  const position = () => ({ x: window.scrollX, y: window.scrollY });
  const commit = () => {
    const key = navigation.currentEntry?.key;
    if (!key) return;
    renderedKey = key;
    positions.set(key, position());
  };
  commit();

  const saveScroll = () => {
    if (navigation.currentEntry?.key === renderedKey) {
      positions.set(renderedKey, position());
    }
  };

  const onEntryChange = () => {
    const key = navigation.currentEntry?.key;
    if (key !== historyKey) {
      // The URL has moved, but the outgoing page is still rendered here.
      positions.set(renderedKey, position());
      historyKey = key ?? "";
    }
    if (
      `${window.location.pathname}${window.location.search}` ===
      getRenderedRoute()
    ) {
      // Hash navigation stays instant and still gets its own saved position.
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(commit);
    }
  };

  navigation.addEventListener("currententrychange", onEntryChange);
  window.addEventListener("scroll", saveScroll, { passive: true });

  return {
    commit,
    prepareRestoration() {
      const key = navigation.currentEntry?.key;
      const saved = key ? positions.get(key) : undefined;
      return () => {
        if (navigation.currentEntry?.key !== key) return;
        if (saved) window.scrollTo(saved.x, saved.y);
        commit();
      };
    },
    dispose() {
      navigation.removeEventListener("currententrychange", onEntryChange);
      window.removeEventListener("scroll", saveScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousRestoration;
    },
  };
}
