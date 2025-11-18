// React Query hooks for Contacts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContacts,
  searchContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getContactConversations,
  updateContactLabels,
} from '@/api/endpoints/contacts';
import type {
  ContactFilters,
  ContactCreatePayload,
  ContactUpdatePayload,
  LabelsPayload,
} from '@/api/types';

// Query keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: ContactFilters) => [...contactKeys.lists(), filters] as const,
  search: (query: string, filters?: ContactFilters) => [...contactKeys.all, 'search', query, filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: number) => [...contactKeys.details(), id] as const,
  conversations: (id: number) => [...contactKeys.detail(id), 'conversations'] as const,
};

// Hook to fetch contacts list
export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: contactKeys.list(filters || {}),
    queryFn: () => getContacts(filters),
    staleTime: 60000, // 1 minute
  });
}

// Hook to search contacts
export function useSearchContacts(query: string, filters?: ContactFilters) {
  return useQuery({
    queryKey: contactKeys.search(query, filters),
    queryFn: () => searchContacts(query, filters),
    enabled: query.length > 0,
    staleTime: 30000,
  });
}

// Hook to fetch single contact
export function useContact(contactId: number | null) {
  return useQuery({
    queryKey: contactKeys.detail(contactId!),
    queryFn: () => getContact(contactId!),
    enabled: !!contactId,
    staleTime: 60000,
  });
}

// Hook to fetch contact conversations
export function useContactConversations(contactId: number | null) {
  return useQuery({
    queryKey: contactKeys.conversations(contactId!),
    queryFn: () => getContactConversations(contactId!),
    enabled: !!contactId,
    staleTime: 30000,
  });
}

// Hook to create a contact
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContactCreatePayload) => createContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
      });
    },
  });
}

// Hook to update a contact
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: number;
      payload: ContactUpdatePayload;
    }) => updateContact(contactId, payload),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
      });
    },
  });
}

// Hook to delete a contact
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: number) => deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
      });
    },
  });
}

// Hook to update contact labels
export function useUpdateContactLabels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: number;
      payload: LabelsPayload;
    }) => updateContactLabels(contactId, payload),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(contactId),
      });
    },
  });
}
