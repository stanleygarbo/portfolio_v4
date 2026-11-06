"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { initialLoadingState, loadingReducer } from "../lib/loadingState";
import {
  manageHistoryScroll,
  type HistoryScrollController,
} from "../lib/historyScroll";

interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
  transitionTypes?: string[];
}

interface LinkNavigationRequest extends NavigationOptions {
  type: "link";
  href: string;
}

type NavigationRequest =
  | LinkNavigationRequest
  | {
      type: "history";
      href: string;
      event: PopStateEvent;
    };

const NAVIGATION_ID = "page-navigation";

const LoadingContext = createContext<{
  isReady: boolean;
  navigate: (href: string, options: NavigationOptions) => void;
} | null>(null);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading requires LoadingProvider");
  return context;
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(loadingReducer, initialLoadingState);
  const [navigation, setNavigation] = useState<NavigationRequest | null>(null);
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef<HTMLDivElement>(null);
  const renderedRouteRef = useRef<string | null>(null);
  const replayedHistoryEventRef = useRef<PopStateEvent | null>(null);
  const historyScrollRef = useRef<HistoryScrollController | null>(null);
  const restoreScrollRef = useRef<(() => void) | null>(null);
  const visible = state.phase !== "hidden";
  const setPending = useCallback((id: string, pending: boolean) => {
    dispatch({
      type: "pending",
      id,
      pending,
      reducedMotion: prefersReducedMotion(),
    });
  }, []);

  const navigate = useCallback(
    (href: string, options: NavigationOptions) => {
      restoreScrollRef.current = null;
      setPending(NAVIGATION_ID, true);
      setNavigation({ type: "link", href, ...options });
    },
    [setPending],
  );

  useEffect(() => {
    if (state.phase !== "covered" || !navigation) return;
    // Commit the destination content only once the cover has arrived.
    startTransition(() => {
      setNavigation(null);
      if (navigation.type === "history") {
        if (navigation.href !== window.location.href) return;
        // Resume the original history entry so Next.js retains its cached state.
        const replay = new PopStateEvent("popstate", {
          state: navigation.event.state,
        });
        replayedHistoryEventRef.current = replay;
        try {
          window.dispatchEvent(replay);
        } finally {
          replayedHistoryEventRef.current = null;
        }
      } else {
        const { href, replace, scroll, transitionTypes } = navigation;
        if (replace) router.replace(href, { scroll, transitionTypes });
        else router.push(href, { scroll, transitionTypes });
      }
    });
  }, [navigation, router, state.phase]);

  useEffect(() => {
    if (!navigation && !isPending && state.pending.includes(NAVIGATION_ID)) {
      // Let the destination's DOM settle before the cover can disappear.
      const frame = requestAnimationFrame(() => {
        restoreScrollRef.current?.();
        restoreScrollRef.current = null;
        historyScrollRef.current?.commit();
        setPending(NAVIGATION_ID, false);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [navigation, isPending, state.pending, setPending]);

  useEffect(() => {
    if (!navigation && !isPending) {
      renderedRouteRef.current = `${pathname}${window.location.search}`;
    }
  }, [pathname, navigation, isPending]);

  useEffect(() => {
    const controller = manageHistoryScroll(() => renderedRouteRef.current);
    historyScrollRef.current = controller;
    return () => {
      controller?.dispose();
      historyScrollRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (event === replayedHistoryEventRef.current) return;
      const restoreScroll = historyScrollRef.current?.prepareRestoration();
      const destinationRoute = `${window.location.pathname}${window.location.search}`;
      if (
        event.state == null ||
        destinationRoute === renderedRouteRef.current
      ) {
        // Same-page history jumps also cancel any link waiting for the cover.
        setNavigation(null);
        setPending(NAVIGATION_ID, false);
        restoreScrollRef.current = null;
        if (restoreScroll) requestAnimationFrame(restoreScroll);
        return;
      }

      // Run before the router's listener, then replay only once fully covered.
      event.stopImmediatePropagation();
      restoreScrollRef.current = restoreScroll ?? null;
      setPending(NAVIGATION_ID, true);
      setNavigation({ type: "history", href: window.location.href, event });
    };
    window.addEventListener("popstate", onPopState, { capture: true });
    return () =>
      window.removeEventListener("popstate", onPopState, { capture: true });
  }, [setPending]);

  useEffect(() => {
    let active = true;
    const ready = () => {
      if (!active) return;
      clearTimeout(timeout);
      dispatch({ type: "ready", reducedMotion: prefersReducedMotion() });
    };
    // A font request must never leave the site behind the cover indefinitely.
    const timeout = window.setTimeout(ready, 5000);
    document.fonts.ready.then(ready, ready);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () =>
      dispatch({ type: "motion", reducedMotion: media.matches });
    media.addEventListener("change", onMotionChange);
    return () => {
      active = false;
      clearTimeout(timeout);
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !visible) return;
    const focused = document.activeElement;
    content.inert = true;
    content.setAttribute("aria-busy", "true");
    return () => {
      content.inert = false;
      content.removeAttribute("aria-busy");
      if (focused instanceof HTMLElement && focused.isConnected) {
        focused.focus({ preventScroll: true });
      }
    };
  }, [visible]);

  const value = useMemo(
    () => ({
      isReady: state.phase === "revealing" || state.phase === "hidden",
      navigate,
    }),
    [state.phase, navigate],
  );

  return (
    <LoadingContext.Provider value={value}>
      <div ref={contentRef}>{children}</div>
      <Cover
        data-loading-screen
        data-phase={state.phase}
        aria-hidden={!visible}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) {
            dispatch({ type: "animationEnd" });
          }
        }}
      >
        <i>{state.initial ? "Loading the greatness..." : "Loading..."}</i>
      </Cover>
      <noscript>
        <style>{"[data-loading-screen] { display: none !important; }"}</style>
      </noscript>
    </LoadingContext.Provider>
  );
}

const cover = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const reveal = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

const Cover = styled.div`
  position: fixed;
  inset: -2px 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141313;
  border-block: 2px solid #333;
  color: white;
  overflow: hidden;

  i {
    font-size: 20px;
    font-weight: 400;
    transition: opacity 0.5s ease;
  }

  &[data-phase="covering"] {
    animation: ${cover} 0.7s cubic-bezier(0.65, 0.05, 0.36, 1) both;
  }

  &[data-phase="revealing"] {
    animation: ${reveal} 0.7s cubic-bezier(0.65, 0.05, 0.36, 1) both;
    i {
      opacity: 0;
    }
  }

  &[data-phase="hidden"] {
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-100%);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none !important;
    i {
      transition: none;
    }
  }
`;
