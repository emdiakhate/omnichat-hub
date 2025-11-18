// React Query hooks for Labels

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
} from '@/api/endpoints/labels';

// Query keys
export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
  details: () => [...labelKeys.all, 'detail'] as const,
  detail: (id: number) => [...labelKeys.details(), id] as const,
};

// Hook to fetch all labels
export function useLabels() {
  return useQuery({
    queryKey: labelKeys.lists(),
    queryFn: getLabels,
    staleTime: 300000, // 5 minutes
  });
}

// Hook to fetch single label
export function useLabel(labelId: number | null) {
  return useQuery({
    queryKey: labelKeys.detail(labelId!),
    queryFn: () => getLabel(labelId!),
    enabled: !!labelId,
    staleTime: 300000,
  });
}

// Hook to create a label
export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description?: string;
      color?: string;
      showOnSidebar?: boolean;
    }) => createLabel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: labelKeys.lists(),
      });
    },
  });
}

// Hook to update a label
export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      labelId,
      payload,
    }: {
      labelId: number;
      payload: {
        title?: string;
        description?: string;
        color?: string;
        showOnSidebar?: boolean;
      };
    }) => updateLabel(labelId, payload),
    onSuccess: (_, { labelId }) => {
      queryClient.invalidateQueries({
        queryKey: labelKeys.detail(labelId),
      });
      queryClient.invalidateQueries({
        queryKey: labelKeys.lists(),
      });
    },
  });
}

// Hook to delete a label
export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelId: number) => deleteLabel(labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: labelKeys.lists(),
      });
    },
  });
}
