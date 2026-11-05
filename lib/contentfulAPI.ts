import { setTimeout as delay } from "node:timers/promises";

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: { message: string }[];
}

async function requestContentful(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const attempts = 3;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(10_000),
      });

      if (
        (response.status !== 429 && response.status < 500) ||
        attempt === attempts - 1
      ) {
        return response;
      }

      await response.body?.cancel();
    } catch (cause) {
      if (attempt === attempts - 1) {
        throw new Error("Unable to reach Contentful.", { cause });
      }
    }

    await delay(500 * 2 ** attempt);
  }

  throw new Error("Unable to reach Contentful.");
}

export async function fetchGraphQL<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      "Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN before building or running the site.",
    );
  }

  const response = await requestContentful(
    `https://graphql.contentful.com/content/v1/spaces/${encodeURIComponent(spaceId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Contentful request failed (HTTP ${response.status}).`);
  }

  let result: GraphQLResponse<T>;

  try {
    result = await response.json();
  } catch (cause) {
    throw new Error("Contentful returned invalid JSON.", { cause });
  }

  if (!result || result.errors?.length || result.data == null) {
    throw new Error("Contentful returned an unsuccessful GraphQL response.");
  }

  return result.data;
}
