// React Query hooks for Inboxes, Teams, Agents, and Profile

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInboxes, getInbox, getInboxAgents } from '@/api/endpoints/inboxes';
import {
  getTeams,
  getTeam,
  getTeamMembers,
  createTeam,
  updateTeam,
  deleteTeam,
} from '@/api/endpoints/teams';
import { getProfile, getAgents } from '@/api/endpoints/profile';

// Query keys
export const inboxKeys = {
  all: ['inboxes'] as const,
  lists: () => [...inboxKeys.all, 'list'] as const,
  details: () => [...inboxKeys.all, 'detail'] as const,
  detail: (id: number) => [...inboxKeys.details(), id] as const,
  agents: (id: number) => [...inboxKeys.detail(id), 'agents'] as const,
};

export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: number) => [...teamKeys.details(), id] as const,
  members: (id: number) => [...teamKeys.detail(id), 'members'] as const,
};

export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
};

export const profileKeys = {
  all: ['profile'] as const,
};

// ==================== Inbox Hooks ====================

// Hook to fetch all inboxes
export function useInboxes() {
  return useQuery({
    queryKey: inboxKeys.lists(),
    queryFn: getInboxes,
    staleTime: 300000, // 5 minutes
  });
}

// Hook to fetch single inbox
export function useInbox(inboxId: number | null) {
  return useQuery({
    queryKey: inboxKeys.detail(inboxId!),
    queryFn: () => getInbox(inboxId!),
    enabled: !!inboxId,
    staleTime: 300000,
  });
}

// Hook to fetch inbox agents
export function useInboxAgents(inboxId: number | null) {
  return useQuery({
    queryKey: inboxKeys.agents(inboxId!),
    queryFn: () => getInboxAgents(inboxId!),
    enabled: !!inboxId,
    staleTime: 300000,
  });
}

// ==================== Team Hooks ====================

// Hook to fetch all teams
export function useTeams() {
  return useQuery({
    queryKey: teamKeys.lists(),
    queryFn: getTeams,
    staleTime: 300000,
  });
}

// Hook to fetch single team
export function useTeam(teamId: number | null) {
  return useQuery({
    queryKey: teamKeys.detail(teamId!),
    queryFn: () => getTeam(teamId!),
    enabled: !!teamId,
    staleTime: 300000,
  });
}

// Hook to fetch team members
export function useTeamMembers(teamId: number | null) {
  return useQuery({
    queryKey: teamKeys.members(teamId!),
    queryFn: () => getTeamMembers(teamId!),
    enabled: !!teamId,
    staleTime: 300000,
  });
}

// Hook to create a team
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string; allowAutoAssign?: boolean }) =>
      createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
    },
  });
}

// Hook to update a team
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      payload,
    }: {
      teamId: number;
      payload: { name?: string; description?: string; allowAutoAssign?: boolean };
    }) => updateTeam(teamId, payload),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({
        queryKey: teamKeys.detail(teamId),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
    },
  });
}

// Hook to delete a team
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
    },
  });
}

// ==================== Agent Hooks ====================

// Hook to fetch all agents
export function useAgents() {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: getAgents,
    staleTime: 300000,
  });
}

// ==================== Profile Hooks ====================

// Hook to fetch current user profile
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfile,
    staleTime: 300000,
  });
}
