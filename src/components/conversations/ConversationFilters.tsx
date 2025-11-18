// Advanced Conversation Filters Component
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useInboxes, useTeams, useAgents } from "@/hooks/useInboxes";
import type { ConversationFilters, ConversationStatus } from "@/api/types";

interface ConversationFiltersProps {
  filters: ConversationFilters;
  onFiltersChange: (filters: ConversationFilters) => void;
}

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'open', label: 'Ouvert' },
  { value: 'pending', label: 'En attente' },
  { value: 'resolved', label: 'Résolu' },
  { value: 'snoozed', label: 'Mis en pause' },
];

const assigneeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'me', label: 'Mes conversations' },
  { value: 'unassigned', label: 'Non assignées' },
  { value: 'assigned', label: 'Assignées' },
];

export function ConversationFiltersComponent({
  filters,
  onFiltersChange,
}: ConversationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch filter options
  const { data: inboxes } = useInboxes();
  const { data: teams } = useTeams();

  // Count active filters
  const activeFiltersCount = [
    filters.status && filters.status !== 'all',
    filters.assigneeType && filters.assigneeType !== 'all',
    filters.inboxId,
    filters.teamId,
    filters.labels && filters.labels.length > 0,
  ].filter(Boolean).length;

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : value as ConversationStatus,
    });
  };

  const handleAssigneeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      assigneeType: value === 'all' ? undefined : value as 'me' | 'unassigned' | 'all' | 'assigned',
    });
  };

  const handleInboxChange = (value: string) => {
    onFiltersChange({
      ...filters,
      inboxId: value === 'all' ? undefined : parseInt(value),
    });
  };

  const handleTeamChange = (value: string) => {
    onFiltersChange({
      ...filters,
      teamId: value === 'all' ? undefined : parseInt(value),
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Filter className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-popover">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filtres</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Effacer
              </Button>
            )}
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assignation</label>
            <Select
              value={filters.assigneeType || 'all'}
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner l'assignation" />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inbox Filter */}
          {inboxes && inboxes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Boîte de réception</label>
              <Select
                value={filters.inboxId?.toString() || 'all'}
                onValueChange={handleInboxChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les boîtes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les boîtes</SelectItem>
                  {inboxes.map((inbox) => (
                    <SelectItem key={inbox.id} value={inbox.id.toString()}>
                      {inbox.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Team Filter */}
          {teams && teams.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Équipe</label>
              <Select
                value={filters.teamId?.toString() || 'all'}
                onValueChange={handleTeamChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les équipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t">
              <label className="text-sm font-medium mb-2 block">Filtres actifs</label>
              <div className="flex flex-wrap gap-2">
                {filters.status && filters.status !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {statusOptions.find(o => o.value === filters.status)?.label}
                  </Badge>
                )}
                {filters.assigneeType && filters.assigneeType !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {assigneeOptions.find(o => o.value === filters.assigneeType)?.label}
                  </Badge>
                )}
                {filters.inboxId && (
                  <Badge variant="secondary" className="text-xs">
                    {inboxes?.find(i => i.id === filters.inboxId)?.name || `Inbox #${filters.inboxId}`}
                  </Badge>
                )}
                {filters.teamId && (
                  <Badge variant="secondary" className="text-xs">
                    {teams?.find(t => t.id === filters.teamId)?.name || `Team #${filters.teamId}`}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
