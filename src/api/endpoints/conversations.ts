// Conversations API Endpoints

import { api, getAccountId } from '../client';
import type {
  Conversation,
  ConversationListResponse,
  ConversationMetaResponse,
  ConversationFilters,
  ConversationUpdatePayload,
  ConversationAssignPayload,
  ToggleStatusPayload,
  ToggleStatusResponse,
  LabelsPayload,
  ConversationLabelsResponse,
} from '../types';

const accountId = getAccountId();

// List all conversations with filters and pagination
export async function getConversations(filters?: ConversationFilters) {
  const response = await api.get<ConversationListResponse>(
    `/api/v1/accounts/${accountId}/conversations`,
    filters as Record<string, string | number | boolean | undefined>
  );
  return response;
}

// Get conversation counts (meta)
export async function getConversationsMeta(filters?: Omit<ConversationFilters, 'page' | 'assigneeType'>) {
  const response = await api.get<ConversationMetaResponse>(
    `/api/v1/accounts/${accountId}/conversations/meta`,
    filters as Record<string, string | number | boolean | undefined>
  );
  return response;
}

// Get single conversation details
export async function getConversation(conversationId: number) {
  const response = await api.get<Conversation>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}`
  );
  return response;
}

// Create new conversation
export async function createConversation(payload: {
  sourceId: string;
  inboxId: number;
  contactId?: number;
  status?: 'open' | 'resolved' | 'pending';
  assigneeId?: number;
  teamId?: number;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  message?: {
    content: string;
    templateParams?: Record<string, unknown>;
  };
}) {
  const response = await api.post<{ id: number; accountId: number; inboxId: number }>(
    `/api/v1/accounts/${accountId}/conversations`,
    payload
  );
  return response;
}

// Update conversation (priority, SLA)
export async function updateConversation(
  conversationId: number,
  payload: ConversationUpdatePayload
) {
  const response = await api.patch<Conversation>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}`,
    payload
  );
  return response;
}

// Toggle conversation status
export async function toggleConversationStatus(
  conversationId: number,
  payload: ToggleStatusPayload
) {
  const response = await api.post<ToggleStatusResponse>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_status`,
    payload
  );
  return response;
}

// Toggle conversation priority
export async function toggleConversationPriority(
  conversationId: number,
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
) {
  const response = await api.post<void>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_priority`,
    { priority }
  );
  return response;
}

// Assign conversation to agent or team
export async function assignConversation(
  conversationId: number,
  payload: ConversationAssignPayload
) {
  const response = await api.post<Conversation>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`,
    payload
  );
  return response;
}

// Get conversation labels
export async function getConversationLabels(conversationId: number) {
  const response = await api.get<ConversationLabelsResponse>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`
  );
  return response;
}

// Add/Update conversation labels
export async function updateConversationLabels(
  conversationId: number,
  payload: LabelsPayload
) {
  const response = await api.post<ConversationLabelsResponse>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`,
    payload
  );
  return response;
}

// Update custom attributes
export async function updateConversationCustomAttributes(
  conversationId: number,
  customAttributes: Record<string, unknown>
) {
  const response = await api.post<{ customAttributes: Record<string, unknown> }>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/custom_attributes`,
    { customAttributes }
  );
  return response;
}
