"use client";

import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid immediate refetching after fetching
        staleTime: 60 * 1000, // 1 minute

        // Prevent refetching when the window regains focus or reconnects
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        // Disable retry for specific use cases (e.g., 404 errors)
        retry: 1, // Retry only once if a query fails

        // Keep failed queries in the cache for inspection

        // Reduce the chance of excessive data re-fetch
        refetchInterval: false,
        refetchIntervalInBackground: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Uncomment to enable React Query devtools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
