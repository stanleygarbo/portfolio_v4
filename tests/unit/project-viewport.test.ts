import assert from "node:assert/strict";
import { test } from "node:test";
import { getActiveProjectIndex } from "../../lib/projectViewport.ts";

const viewport = { viewportHeight: 1000, atPageEnd: false };

test("uses the default palette when no project occupies the reading position", () => {
  assert.equal(getActiveProjectIndex([], viewport), null);
  assert.equal(
    getActiveProjectIndex([{ top: 600, bottom: 1400 }], viewport),
    null,
  );
  assert.equal(
    getActiveProjectIndex([{ top: -600, bottom: 400 }], viewport),
    null,
  );
  assert.equal(
    getActiveProjectIndex([{ top: 0, bottom: 1000 }], {
      ...viewport,
      viewportHeight: 0,
    }),
    null,
  );
});

test("keeps a tall project's palette while its lower content is being read", () => {
  assert.equal(
    getActiveProjectIndex([{ top: -1700, bottom: 800 }], viewport),
    0,
  );
});

test("selects the project containing the viewport center regardless of card height", () => {
  const projects = [
    { top: -900, bottom: -200 },
    { top: -100, bottom: 1000 },
    { top: 1100, bottom: 1500 },
  ];
  assert.equal(getActiveProjectIndex(projects, viewport), 1);
});

test("shares the gap between projects without resetting to the default palette", () => {
  const projects = [
    { top: -300, bottom: 450 },
    { top: 550, bottom: 1400 },
  ];
  assert.equal(
    getActiveProjectIndex(projects, { ...viewport, viewportHeight: 998 }),
    0,
  );
  assert.equal(getActiveProjectIndex(projects, viewport), 1);
  assert.equal(
    getActiveProjectIndex(projects, { ...viewport, viewportHeight: 1002 }),
    1,
  );
});

test("recalculates the reading position when the viewport is resized", () => {
  const projects = [
    { top: -200, bottom: 400 },
    { top: 500, bottom: 1800 },
  ];
  assert.equal(
    getActiveProjectIndex(projects, { ...viewport, viewportHeight: 600 }),
    0,
  );
  assert.equal(
    getActiveProjectIndex(projects, { ...viewport, viewportHeight: 1200 }),
    1,
  );
});

test("restores the default palette at the page end even if the footer is short", () => {
  assert.equal(
    getActiveProjectIndex([{ top: -800, bottom: 700 }], {
      ...viewport,
      atPageEnd: true,
    }),
    null,
  );
});

test("produces the same palettes when scrolling forward and backward", () => {
  const projects = [
    { top: 1000, bottom: 1800 },
    { top: 1900, bottom: 2300 },
    { top: 2400, bottom: 4100 },
  ];
  const positions = [
    { scrollY: 0, expected: null },
    { scrollY: 900, expected: 0 },
    { scrollY: 1500, expected: 1 },
    { scrollY: 2300, expected: 2 },
    { scrollY: 3700, expected: null },
  ];

  for (const { scrollY, expected } of [
    ...positions,
    ...positions.toReversed(),
  ]) {
    const bounds = projects.map(({ top, bottom }) => ({
      top: top - scrollY,
      bottom: bottom - scrollY,
    }));
    assert.equal(getActiveProjectIndex(bounds, viewport), expected);
  }
});
