import { useRef } from "react";
import { useQuery } from "convex/react";

export function useStableQuery<Query extends (...args: any) => any>(
  query: Query,
  args: Parameters<Query>[0]
) {
  const result = useQuery(query as any, args as any);
  const last = useRef<any>(undefined);

  if (result !== undefined) {
    last.current = result;
  }

  return result === undefined ? last.current : result;
}