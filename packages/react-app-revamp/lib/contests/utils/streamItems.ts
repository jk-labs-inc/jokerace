import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";

/**
 * Generic utility function for streaming database results with parallel processing.
 * Processes each item as soon as it completes, yielding results one by one.
 *
 * @param tableName
 * @param queryModifier
 * @param processor
 * @param pageOptions
 * @param columns
 */
export async function* streamProcessItems<T, R>(
  tableName: string,
  queryModifier: (query: any) => any,
  processor: (item: T) => Promise<R | null>,
  pageOptions: { currentPage: number; itemsPerPage: number },
  columns: string = "*",
): AsyncGenerator<R, void, unknown> {
  if (!isSupabaseConfigured) return;

  const config = await import("@config/supabase");
  const { from, to } = getPagination(pageOptions.currentPage, pageOptions.itemsPerPage);

  try {
    let query = config.supabase.from(tableName).select(columns).range(from, to);

    query = queryModifier(query);

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return;

    const processPromises = data.map(item => processor(item as T));

    yield* streamPromiseResults(processPromises);
  } catch (e) {
    console.error("Error in streamProcessItems:", e);
  }
}

/**
 * Generic utility function for streaming results from a collection of promises
 * Yields each result as soon as it completes, without waiting for all promises
 *
 * @param promises Array of promises to process in parallel
 */
export async function* streamPromiseResults<R>(promises: Promise<R | null>[]): AsyncGenerator<R, void, unknown> {
  const remaining = [...promises];

  while (remaining.length > 0) {
    try {
      const nextPromiseIndex = await Promise.race(
        remaining.map((promise, index) =>
          promise
            .then(() => index)
            .catch(() => {
              console.error(`Error processing an item, skipping.`);
              return index;
            }),
        ),
      );

      const result = await remaining[nextPromiseIndex];
      remaining.splice(nextPromiseIndex, 1);

      if (result) yield result;
    } catch (err) {
      console.error("Error in streamPromiseResults:", err);
    }
  }
}
