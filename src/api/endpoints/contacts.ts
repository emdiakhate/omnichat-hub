// Contacts API Endpoints

import { api, getAccountId } from '../client';
import type {
  Contact,
  ContactsListResponse,
  ContactShowResponse,
  ContactFilters,
  ContactCreatePayload,
  ContactUpdatePayload,
  ContactLabelsResponse,
  LabelsPayload,
  ContactConversationsResponse,
} from '../types';

const accountId = getAccountId();

// List all contacts with pagination
export async function getContacts(filters?: ContactFilters) {
  const response = await api.get<ContactsListResponse>(
    `/api/v1/accounts/${accountId}/contacts`,
    filters as Record<string, string | number | boolean | undefined>
  );
  return response;
}

// Search contacts
export async function searchContacts(query: string, filters?: ContactFilters) {
  const response = await api.get<ContactsListResponse>(
    `/api/v1/accounts/${accountId}/contacts/search`,
    { q: query, ...filters } as Record<string, string | number | boolean | undefined>
  );
  return response;
}

// Get single contact details
export async function getContact(contactId: number) {
  const response = await api.get<ContactShowResponse>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}`
  );
  return response;
}

// Create a new contact
export async function createContact(payload: ContactCreatePayload) {
  const response = await api.post<Contact>(
    `/api/v1/accounts/${accountId}/contacts`,
    payload
  );
  return response;
}

// Update a contact
export async function updateContact(contactId: number, payload: ContactUpdatePayload) {
  const response = await api.put<Contact>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}`,
    payload
  );
  return response;
}

// Delete a contact
export async function deleteContact(contactId: number) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}`
  );
  return response;
}

// Get contact conversations
export async function getContactConversations(contactId: number) {
  const response = await api.get<ContactConversationsResponse>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/conversations`
  );
  return response;
}

// Get contact labels
export async function getContactLabels(contactId: number) {
  const response = await api.get<ContactLabelsResponse>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/labels`
  );
  return response;
}

// Add/Update contact labels
export async function updateContactLabels(contactId: number, payload: LabelsPayload) {
  const response = await api.post<ContactLabelsResponse>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/labels`,
    payload
  );
  return response;
}

// Get contactable inboxes
export async function getContactableInboxes(contactId: number) {
  const response = await api.get<{ payload: Array<{ sourceId: string; inbox: unknown }> }>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/contactable_inboxes`
  );
  return response;
}

// Create contact inbox
export async function createContactInbox(
  contactId: number,
  inboxId: number,
  sourceId?: string
) {
  const response = await api.post<unknown>(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/contact_inboxes`,
    { inboxId, sourceId }
  );
  return response;
}
