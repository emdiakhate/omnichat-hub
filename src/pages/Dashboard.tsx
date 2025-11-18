import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, Users as UsersIcon, Star, TrendingUp, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useConversations, useConversationsMeta } from "@/hooks/useConversations";
import { useTeams, useAgents } from "@/hooks/useInboxes";
import {
  StatCardSkeleton,
  TeamCardSkeleton,
  ConversationCardSkeleton,
  ErrorState
} from "@/components/ui/loading-states";
import type { Conversation, Team } from "@/api/types";

export default function Dashboard() {
  // Fetch data using hooks
  const {
    data: conversationsMeta,
    isLoading: metaLoading,
    error: metaError,
    refetch: refetchMeta
  } = useConversationsMeta();

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations
  } = useConversations({ status: 'open' });

  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams
  } = useTeams();

  const {
    data: agents,
    isLoading: agentsLoading
  } = useAgents();

  // Extract conversations from response
  const conversations = conversationsData?.data?.payload || [];
  const meta = conversationsMeta?.meta || conversationsData?.data?.meta;

  // Build stats from API data
  const stats = [
    {
      title: "Messages non lus",
      value: meta?.unassignedCount?.toString() || "0",
      trend: undefined,
      color: "primary" as const,
      icon: MessageSquare,
    },
    {
      title: "Temps de réponse",
      value: "~5 min",
      trend: "-12%",
      color: "success" as const,
      icon: Clock,
    },
    {
      title: "Conversations actives",
      value: meta?.allCount?.toString() || "0",
      trend: undefined,
      color: "warning" as const,
      icon: UsersIcon,
    },
    {
      title: "Agents en ligne",
      value: agents?.filter(a => a.availabilityStatus === 'online').length?.toString() || "0",
      trend: undefined,
      color: "secondary" as const,
      icon: Star,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(metaLoading || agentsLoading) ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : metaError ? (
            <div className="col-span-full">
              <ErrorState
                message="Erreur lors du chargement des statistiques"
                onRetry={() => refetchMeta()}
              />
            </div>
          ) : (
            stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                icon={stat.icon}
                color={stat.color}
              />
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volume Chart */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Volume de messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Graphique: Volume des 7 derniers jours</p>
              </div>
            </CardContent>
          </Card>

          {/* Teams Distribution */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-secondary" />
                Distribution par équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamsLoading ? (
                <div className="space-y-4">
                  <TeamCardSkeleton />
                  <TeamCardSkeleton />
                  <TeamCardSkeleton />
                </div>
              ) : teamsError ? (
                <ErrorState
                  message="Erreur lors du chargement des équipes"
                  onRetry={() => refetchTeams()}
                />
              ) : teams && teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team: Team) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <UsersIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.description || 'Équipe'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={team.allowAutoAssign ? "default" : "secondary"}>
                          {team.allowAutoAssign ? "Auto-assign" : "Manuel"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune équipe configurée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Conversations récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conversationsLoading ? (
              <div className="space-y-3">
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
              </div>
            ) : conversationsError ? (
              <ErrorState
                message="Erreur lors du chargement des conversations"
                onRetry={() => refetchConversations()}
              />
            ) : conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(0, 5).map((conv: Conversation) => {
                  const sender = conv.meta?.sender;
                  const assignee = conv.meta?.assignee;
                  const lastMessage = conv.lastNonActivityMessage?.content || conv.messages?.[0]?.content || '';

                  return (
                    <div
                      key={conv.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={sender?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || conv.id}`}
                          alt={sender?.name || 'Contact'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {sender?.availabilityStatus === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{sender?.name || `Contact #${conv.id}`}</p>
                          {conv.labels?.slice(0, 2).map((label) => (
                            <Badge
                              key={label}
                              variant="secondary"
                              className="text-xs px-1.5 py-0"
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage || 'Pas de message'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastActivityAt
                            ? formatDistanceToNow(new Date(conv.lastActivityAt * 1000), { locale: fr, addSuffix: true })
                            : 'Récemment'
                          }
                        </span>
                        {assignee && (
                          <Badge variant="outline" className="text-xs">
                            {assignee.name}
                          </Badge>
                        )}
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-primary text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune conversation récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
