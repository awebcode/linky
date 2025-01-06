import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface QueryOptions<TData> extends UseQueryOptions<TData> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
}

export const useFetchData = <TData,>({
  queryKey,
  queryFn,
  ...options
}: QueryOptions<TData>) => {
  return useQuery<TData>({
    queryKey,
    queryFn,
    ...options,
  });
};
