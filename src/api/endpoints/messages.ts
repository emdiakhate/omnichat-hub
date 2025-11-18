// Messages API Endpoints

import { api, getAccountId } from '../client';
import type { Message, MessagesResponse, MessageCreatePayload } from '../types';

const accountId = getAccountId();

// Get all messages from a conversation
export async function getMessages(conversationId: number) {
  const response = await api.get<MessagesResponse>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`
  );
  return response;
}

// Create a new message in a conversation
export async function createMessage(
  conversationId: number,
  payload: MessageCreatePayload
) {
  const response = await api.post<Message>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
    payload
  );
  return response;
}

// Delete a message
export async function deleteMessage(conversationId: number, messageId: number) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages/${messageId}`
  );
  return response;
}
