// Teams API Endpoints

import { api, getAccountId } from '../client';
import type { Team, Agent } from '../types';

const accountId = getAccountId();

// List all teams
export async function getTeams() {
  const response = await api.get<Team[]>(
    `/api/v1/accounts/${accountId}/teams`
  );
  return response;
}

// Get single team details
export async function getTeam(teamId: number) {
  const response = await api.get<Team>(
    `/api/v1/accounts/${accountId}/teams/${teamId}`
  );
  return response;
}

// Create a new team
export async function createTeam(payload: {
  name: string;
  description?: string;
  allowAutoAssign?: boolean;
}) {
  const response = await api.post<Team>(
    `/api/v1/accounts/${accountId}/teams`,
    payload
  );
  return response;
}

// Update a team
export async function updateTeam(
  teamId: number,
  payload: {
    name?: string;
    description?: string;
    allowAutoAssign?: boolean;
  }
) {
  const response = await api.patch<Team>(
    `/api/v1/accounts/${accountId}/teams/${teamId}`,
    payload
  );
  return response;
}

// Delete a team
export async function deleteTeam(teamId: number) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/teams/${teamId}`
  );
  return response;
}

// Get team members
export async function getTeamMembers(teamId: number) {
  const response = await api.get<Agent[]>(
    `/api/v1/accounts/${accountId}/teams/${teamId}/team_members`
  );
  return response;
}

// Add members to team
export async function addTeamMembers(teamId: number, userIds: number[]) {
  const response = await api.post<Agent[]>(
    `/api/v1/accounts/${accountId}/teams/${teamId}/team_members`,
    { userIds }
  );
  return response;
}

// Update team members
export async function updateTeamMembers(teamId: number, userIds: number[]) {
  const response = await api.patch<Agent[]>(
    `/api/v1/accounts/${accountId}/teams/${teamId}/team_members`,
    { userIds }
  );
  return response;
}

// Remove members from team
export async function removeTeamMembers(teamId: number, userIds: number[]) {
  const response = await api.delete<void>(
    `/api/v1/accounts/${accountId}/teams/${teamId}/team_members`
  );
  return response;
}
