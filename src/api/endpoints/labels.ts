// API endpoints for Labels management

import { api, accountId } from '../client';
import type { Label } from '../types';

// Get all labels
export async function getLabels() {
  const response = await api.get<{ payload: Label[] }>(
    `/api/v1/accounts/${accountId}/labels`
  );
  return response.payload || response;
}

// Get single label
export async function getLabel(labelId: number) {
  const response = await api.get<Label>(
    `/api/v1/accounts/${accountId}/labels/${labelId}`
  );
  return response;
}

// Create a label
export async function createLabel(payload: {
  title: string;
  description?: string;
  color?: string;
  showOnSidebar?: boolean;
}) {
  const response = await api.post<Label>(
    `/api/v1/accounts/${accountId}/labels`,
    payload
  );
  return response;
}

// Update a label
export async function updateLabel(
  labelId: number,
  payload: {
    title?: string;
    description?: string;
    color?: string;
    showOnSidebar?: boolean;
  }
) {
  const response = await api.patch<Label>(
    `/api/v1/accounts/${accountId}/labels/${labelId}`,
    payload
  );
  return response;
}

// Delete a label
export async function deleteLabel(labelId: number) {
  await api.delete(`/api/v1/accounts/${accountId}/labels/${labelId}`);
}
