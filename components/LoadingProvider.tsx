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
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { initialLoadingState, loadingReducer } from "../lib/loadingState";

interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
  transitionTypes?: string[];
}

interface NavigationRequest extends NavigationOptions {
  href: string;
}

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
  const [state, dispatch] = useReducer(loadingReducer, initialLoadingState);
  const [navigation, setNavigation] = useState<NavigationRequest | null>(null);
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef<HTMLDivElement>(null);
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
      setPending(NAVIGATION_ID, true);
      setNavigation({ href, ...options });
    },
    [setPending],
  );

  useEffect(() => {
    if (state.phase !== "covered" || !navigation) return;
    // Keep both the URL and current page intact until the cover has arrived.
    startTransition(() => {
      setNavigation(null);
      const { href, replace, ...options } = navigation;
      if (replace) router.replace(href, options);
      else router.push(href, options);
    });
  }, [navigation, router, state.phase]);

  useEffect(() => {
    if (!navigation && !isPending && state.pending.includes(NAVIGATION_ID)) {
      // Let the destination's DOM settle before the cover can disappear.
      const frame = requestAnimationFrame(() =>
        setPending(NAVIGATION_ID, false),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [navigation, isPending, state.pending, setPending]);

  useEffect(() => {
    const cancelQueuedNavigation = () => {
      setNavigation(null);
      setPending(NAVIGATION_ID, false);
    };
    window.addEventListener("popstate", cancelQueuedNavigation);
    return () => window.removeEventListener("popstate", cancelQueuedNavigation);
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
