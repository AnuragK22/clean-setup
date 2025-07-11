import { QueryClient } from "@tanstack/react-query";

// Time in milliseconds before data becomes stale
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Time in milliseconds before inactive queries are garbage collected
const GC_TIME = 10 * 60 * 1000; // 10 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    },
  },
});
