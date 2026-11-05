import assert from "node:assert/strict";
import { test } from "node:test";
import {
  initialLoadingState,
  loadingReducer,
  type LoadingState,
} from "../../lib/loadingState.ts";

const ready = { type: "ready", reducedMotion: false } as const;
const animationEnd = { type: "animationEnd" } as const;
const pending = (id: string, value: boolean, reducedMotion = false) =>
  ({ type: "pending", id, pending: value, reducedMotion }) as const;
const hidden: LoadingState = {
  ...initialLoadingState,
  ready: true,
  phase: "hidden",
};

test("reveals the initial page as soon as it is ready", () => {
  const revealing = loadingReducer(initialLoadingState, ready);
  assert.equal(revealing.phase, "revealing");
  assert.equal(revealing.initial, true);
  assert.equal(loadingReducer(revealing, animationEnd).phase, "hidden");
});

test("finishes covering before revealing a quickly completed navigation", () => {
  const covering = loadingReducer(hidden, pending("project", true));
  assert.equal(covering.phase, "covering");
  assert.equal(covering.initial, false);
  const completed = loadingReducer(covering, pending("project", false));
  assert.equal(completed.phase, "covering");
  const revealing = loadingReducer(completed, animationEnd);
  assert.equal(revealing.phase, "revealing");
  assert.equal(loadingReducer(revealing, animationEnd).phase, "hidden");
});

test("stays covered until every pending navigation completes or is canceled", () => {
  let state = loadingReducer(hidden, pending("first", true));
  state = loadingReducer(state, pending("second", true));
  state = loadingReducer(state, animationEnd);
  state = loadingReducer(state, pending("first", false));
  assert.equal(state.phase, "covered");
  state = loadingReducer(state, pending("second", false));
  assert.equal(state.phase, "revealing");
});

test("covers the page again if a new navigation starts during the reveal", () => {
  const revealing = loadingReducer(initialLoadingState, ready);
  const state = loadingReducer(revealing, pending("next", true));
  assert.equal(state.phase, "covering");
  assert.equal(loadingReducer(state, animationEnd).phase, "covered");
});

test("skips animation with reduced motion, including a preference change mid-slide", () => {
  const initial = loadingReducer(initialLoadingState, {
    ...ready,
    reducedMotion: true,
  });
  assert.equal(initial.phase, "hidden");
  const covered = loadingReducer(initial, pending("next", true, true));
  assert.equal(covered.phase, "covered");
  assert.equal(
    loadingReducer(covered, pending("next", false, true)).phase,
    "hidden",
  );

  const revealing = loadingReducer(initialLoadingState, ready);
  assert.equal(
    loadingReducer(revealing, {
      type: "motion",
      reducedMotion: true,
    }).phase,
    "hidden",
  );
});
