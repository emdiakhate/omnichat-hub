// Profile & Agents API Endpoints

import { api, getAccountId } from '../client';
import type { User, Agent } from '../types';

const accountId = getAccountId();

// Fetch current user profile
export async function getProfile() {
  const response = await api.get<User>('/api/v1/profile');
  return response;
}

// List all agents in account
export async function getAgents() {
  const response = await api.get<Agent[]>(
    `/api/v1/accounts/${accountId}/agents`
  );
  return response;
}

// Get single agent
export async function getAgent(agentId: number) {
  const response = await api.get<Agent>(
    `/api/v1/accounts/${accountId}/agents/${agentId}`
  );
  return response;
}

// Add new agent
export async function createAgent(payload: {
  name: string;
  email: string;
  role: 'agent' | 'administrator';
  availabilityStatus?: 'available' | 'busy' | 'offline';
  autoOffline?: boolean;
}) {
  const response = await api.post<Agent>(
    `/api/v1/accounts/${accountId}/agents`,
    payload
  );
  return response;
}

// Update agent
export async function updateAgent(
  agentId: number,
  payload: {
    role?: 'agent' | 'administrator';
    availabilityStatus?: 'available' | 'busy' | 'offline';
    autoOffline?: boolean;
  }
) {
  const response = await api.patch<Agent>(
    `/api/v1/accounts/${accountId}/agents/${agentId}`,
    payload
  );
  return response;
}

// Delete agent
export async function deleteAgent(agentId: number) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/agents/${agentId}`
  );
  return response;
}
