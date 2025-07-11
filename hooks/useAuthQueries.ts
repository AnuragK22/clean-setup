import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/apiService/apiClient";
import { AxiosError } from "axios";

// For public APIs that don't require authentication
export function usePublicQuery<TData = unknown, TError = AxiosError>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => apiClient.get<TData>(endpoint),
    ...options,
  });
}

// For protected APIs that require authentication
export function useProtectedQuery<TData = unknown, TError = AxiosError>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => apiClient.get<TData>(endpoint, { requiresAuth: true }),
    ...options,
  });
}

// For public mutations
export function usePublicMutation<
  TData = unknown,
  TVariables = void,
  TError = AxiosError,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

// For protected mutations
export function useProtectedMutation<
  TData = unknown,
  TVariables = void,
  TError = AxiosError,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      return await mutationFn(variables);
    },
    ...options,
  });
}
