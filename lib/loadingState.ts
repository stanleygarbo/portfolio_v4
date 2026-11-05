export type LoadingPhase = "covered" | "covering" | "revealing" | "hidden";

export interface LoadingState {
  ready: boolean;
  pending: readonly string[];
  phase: LoadingPhase;
  reducedMotion: boolean;
  initial: boolean;
}

export type LoadingAction =
  | { type: "ready"; reducedMotion: boolean }
  | { type: "pending"; id: string; pending: boolean; reducedMotion: boolean }
  | { type: "motion"; reducedMotion: boolean }
  | { type: "animationEnd" };

export const initialLoadingState: LoadingState = {
  ready: false,
  pending: [],
  phase: "covered",
  reducedMotion: false,
  initial: true,
};

function reconcile(state: LoadingState): LoadingState {
  const busy = !state.ready || state.pending.length > 0;
  if (state.reducedMotion) {
    return { ...state, phase: busy ? "covered" : "hidden" };
  }
  if (busy && (state.phase === "hidden" || state.phase === "revealing")) {
    return { ...state, phase: "covering" };
  }
  if (!busy && state.phase === "covered") {
    return { ...state, phase: "revealing" };
  }
  return state;
}

export function loadingReducer(
  state: LoadingState,
  action: LoadingAction,
): LoadingState {
  switch (action.type) {
    case "ready":
      return reconcile({
        ...state,
        ready: true,
        reducedMotion: action.reducedMotion,
      });
    case "pending": {
      const pending = state.pending.filter((id) => id !== action.id);
      if (action.pending) pending.push(action.id);
      return reconcile({
        ...state,
        pending,
        reducedMotion: action.reducedMotion,
        initial: state.initial && state.phase !== "hidden",
      });
    }
    case "motion":
      return reconcile({ ...state, reducedMotion: action.reducedMotion });
    case "animationEnd":
      return reconcile({
        ...state,
        phase:
          state.phase === "covering"
            ? "covered"
            : state.phase === "revealing"
              ? "hidden"
              : state.phase,
      });
  }
}
