const API_BASES = [
  (import.meta.env.VITE_DJANGO_API_BASE_URL as string | undefined)?.replace(/\/$/, ""),
  "",
  "http://127.0.0.1:8000",
  "http://127.0.0.1:8002",
].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index) as string[];

const asArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown[] }).results)) {
    return (payload as { results: T[] }).results;
  }
  return [];
};

export async function fetchAnnexRows<T>(resourcePath: string): Promise<T[] | null> {
  for (const base of API_BASES) {
    const url = `${base}/api/${resourcePath}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;
      const payload = await response.json();
      return asArray<T>(payload);
    } catch {
      // Try the next known API base.
    }
  }
  return null;
}
