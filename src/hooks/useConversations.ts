// React Query hooks for Conversations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getConversationsMeta,
  getConversation,
  toggleConversationStatus,
  assignConversation,
  updateConversationLabels,
} from '@/api/endpoints/conversations';
import { getMessages, createMessage } from '@/api/endpoints/messages';
import type {
  ConversationFilters,
  ToggleStatusPayload,
  ConversationAssignPayload,
  LabelsPayload,
  MessageCreatePayload,
} from '@/api/types';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: ConversationFilters) => [...conversationKeys.lists(), filters] as const,
  meta: (filters?: Omit<ConversationFilters, 'page' | 'assigneeType'>) => [...conversationKeys.all, 'meta', filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: number) => [...conversationKeys.details(), id] as const,
  messages: (id: number) => [...conversationKeys.detail(id), 'messages'] as const,
};

// Hook to fetch conversations list
export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: conversationKeys.list(filters || {}),
    queryFn: () => getConversations(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Hook to fetch conversation meta (counts)
export function useConversationsMeta(filters?: Omit<ConversationFilters, 'page' | 'assigneeType'>) {
  return useQuery({
    queryKey: conversationKeys.meta(filters),
    queryFn: () => getConversationsMeta(filters),
    staleTime: 30000,
  });
}

// Hook to fetch single conversation
export function useConversation(conversationId: number | null) {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId!),
    queryFn: () => getConversation(conversationId!),
    enabled: !!conversationId,
    staleTime: 30000,
  });
}

// Hook to fetch messages for a conversation
export function useMessages(conversationId: number | null) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId!),
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 10000, // 10 seconds
  });
}

// Hook to send a message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: number;
      payload: MessageCreatePayload;
    }) => createMessage(conversationId, payload),
    onSuccess: (_, { conversationId }) => {
      // Invalidate messages to refetch
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });
      // Also invalidate conversation details
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
      // Invalidate conversation list to update last message
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

// Hook to toggle conversation status
export function useToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: number;
      payload: ToggleStatusPayload;
    }) => toggleConversationStatus(conversationId, payload),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.meta(),
      });
    },
  });
}

// Hook to assign conversation
export function useAssignConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: number;
      payload: ConversationAssignPayload;
    }) => assignConversation(conversationId, payload),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

// Hook to update conversation labels
export function useUpdateLabels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: number;
      payload: LabelsPayload;
    }) => updateConversationLabels(conversationId, payload),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}
