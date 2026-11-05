import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { fetchGraphQL } from "../../lib/contentfulAPI.ts";
import { getProjectBySlug, getProjectSlugs } from "../../lib/projects.ts";

const originalSpaceId = process.env.CONTENTFUL_SPACE_ID;
const originalAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

beforeEach(() => {
  process.env.CONTENTFUL_SPACE_ID = "test-space";
  process.env.CONTENTFUL_ACCESS_TOKEN = "test-token";
});

afterEach(() => {
  mock.restoreAll();
  if (originalSpaceId === undefined) delete process.env.CONTENTFUL_SPACE_ID;
  else process.env.CONTENTFUL_SPACE_ID = originalSpaceId;
  if (originalAccessToken === undefined)
    delete process.env.CONTENTFUL_ACCESS_TOKEN;
  else process.env.CONTENTFUL_ACCESS_TOKEN = originalAccessToken;
});

test("sends authenticated requests with variables and a timeout", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ data: { projectCollection: { items: [] } } }),
  );

  await fetchGraphQL({
    query: "query($slug: String!) { projectCollection { items { slug } } }",
    variables: { slug: "demo" },
  });

  const [url, init] = fetchMock.mock.calls[0].arguments;
  assert.ok(init);
  assert.equal(
    url,
    "https://graphql.contentful.com/content/v1/spaces/test-space",
  );
  assert.equal(init.method, "POST");
  assert.deepEqual(init.headers, {
    "Content-Type": "application/json",
    Authorization: "Bearer test-token",
  });
  assert.equal(JSON.parse(init.body as string).variables.slug, "demo");
  assert.ok(init.signal instanceof AbortSignal);
});

test("rejects missing configuration before making a request", async () => {
  delete process.env.CONTENTFUL_ACCESS_TOKEN;
  const fetchMock = mock.method(globalThis, "fetch");
  await assert.rejects(
    fetchGraphQL({ query: "query { __typename }" }),
    /Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN/,
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

for (const status of [401, 429, 500]) {
  test(`rejects HTTP ${status} instead of treating it as missing content`, async () => {
    const fetchMock = mock.method(
      globalThis,
      "fetch",
      async () => new Response("Unavailable", { status }),
    );
    await assert.rejects(
      getProjectBySlug("demo"),
      new RegExp(`HTTP ${status}`),
    );
    assert.equal(fetchMock.mock.callCount(), status === 401 ? 1 : 3);
  });
}

test("rejects network failures", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
  await assert.rejects(getProjectBySlug("demo"), /Unable to reach Contentful/);
});

for (const failure of ["HTTP 429", "HTTP 503", "timeout", "network"]) {
  test(`recovers after a transient ${failure}`, async () => {
    let attempts = 0;
    mock.method(globalThis, "fetch", async () => {
      attempts++;
      if (attempts === 1) {
        if (failure === "timeout")
          throw new DOMException("Timed out", "TimeoutError");
        if (failure === "network") throw new TypeError("fetch failed");
        return new Response("Unavailable", {
          status: failure === "HTTP 429" ? 429 : 503,
        });
      }
      return Response.json({
        data: { projectCollection: { items: [{ slug: "demo" }] } },
      });
    });
    assert.deepEqual(await getProjectSlugs(), [{ slug: "demo" }]);
    assert.equal(attempts, 2);
  });
}

test("rejects invalid JSON", async () => {
  mock.method(globalThis, "fetch", async () => new Response("not JSON"));
  await assert.rejects(getProjectBySlug("demo"), /invalid JSON/);
});

test("rejects GraphQL errors even when partial data is returned", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: { projectCollection: { items: [] } },
      errors: [{ message: "Upstream failure" }],
    }),
  );
  await assert.rejects(
    getProjectBySlug("demo"),
    /unsuccessful GraphQL response/,
  );
});

for (const response of [null, {}, { data: null }]) {
  test(`rejects missing GraphQL data: ${JSON.stringify(response)}`, async () => {
    mock.method(globalThis, "fetch", async () => Response.json(response));
    await assert.rejects(
      getProjectBySlug("demo"),
      /unsuccessful GraphQL response/,
    );
  });
}

test("rejects malformed collections", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({ data: { projectCollection: null } }),
  );
  await assert.rejects(getProjectBySlug("demo"), /invalid project collection/);
});

test("returns missing content only for a successful empty collection", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({ data: { projectCollection: { items: [] } } }),
  );
  assert.equal(await getProjectBySlug("missing"), null);
});

test("ignores null collection entries", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: { projectCollection: { items: [null, { slug: "demo" }] } },
    }),
  );
  assert.deepEqual(await getProjectSlugs(), [{ slug: "demo" }]);
});
