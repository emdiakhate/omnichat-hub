// Inboxes API Endpoints

import { api, getAccountId } from '../client';
import type { Inbox, InboxesResponse, Agent } from '../types';

const accountId = getAccountId();

// List all inboxes
export async function getInboxes() {
  const response = await api.get<InboxesResponse>(
    `/api/v1/accounts/${accountId}/inboxes`
  );
  return response;
}

// Get single inbox details
export async function getInbox(inboxId: number) {
  const response = await api.get<Inbox>(
    `/api/v1/accounts/${accountId}/inboxes/${inboxId}/`
  );
  return response;
}

// Get agents in inbox
export async function getInboxAgents(inboxId: number) {
  const response = await api.get<{ payload: Agent[] }>(
    `/api/v1/accounts/${accountId}/inbox_members/${inboxId}`
  );
  return response;
}

// Add agents to inbox
export async function addInboxAgents(inboxId: number, userIds: number[]) {
  const response = await api.post<{ payload: Agent[] }>(
    `/api/v1/accounts/${accountId}/inbox_members`,
    { inboxId, userIds }
  );
  return response;
}

// Update agents in inbox
export async function updateInboxAgents(inboxId: number, userIds: number[]) {
  const response = await api.patch<{ payload: Agent[] }>(
    `/api/v1/accounts/${accountId}/inbox_members`,
    { inboxId, userIds }
  );
  return response;
}

// Remove agents from inbox
export async function removeInboxAgents(inboxId: number, userIds: number[]) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/inbox_members`
  );
  return response;
}
