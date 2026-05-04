/**
 * Next.js 15+ passes `searchParams` as a Promise; guard `undefined` and plain
 * objects so destructuring never throws (avoids rare 500s on some clients).
 */
export async function resolveSearchParamsRecord(
  searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined> | undefined
): Promise<Record<string, string | string[] | undefined>> {
  if (searchParams == null) return {};
  const maybeThenable = searchParams as Promise<Record<string, string | string[] | undefined>> & {
    then?: unknown;
  };
  if (typeof maybeThenable.then === "function") {
    return await maybeThenable;
  }
  return searchParams;
}

export function firstQueryValue(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  return typeof v === "string" ? v : v[0];
}
