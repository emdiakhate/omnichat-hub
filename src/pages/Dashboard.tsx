import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, Users as UsersIcon, Star, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import type { Conversation, Team } from "@/api/types";

// Mock data for charts (in real app, this would come from API)
const messageVolumeData = [
  { name: "Lun", messages: 45, resolved: 38 },
  { name: "Mar", messages: 52, resolved: 45 },
  { name: "Mer", messages: 38, resolved: 32 },
  { name: "Jeu", messages: 65, resolved: 58 },
  { name: "Ven", messages: 48, resolved: 42 },
  { name: "Sam", messages: 28, resolved: 25 },
  { name: "Dim", messages: 18, resolved: 15 },
];

const channelDistributionData = [
  { name: "Email", value: 35, color: "#1F93FF" },
  { name: "WhatsApp", value: 28, color: "#25D366" },
  { name: "Website", value: 22, color: "#7C3AED" },
  { name: "Facebook", value: 15, color: "#1877F2" },
];

const statusDistributionData = [
  { name: "Ouvertes", value: 24, color: "#F59E0B" },
  { name: "En attente", value: 12, color: "#6366F1" },
  { name: "Résolues", value: 64, color: "#10B981" },
];

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
      title: "Conversations ouvertes",
      value: meta?.allCount?.toString() || "0",
      trend: "+8%",
      color: "primary" as const,
      icon: MessageSquare,
    },
    {
      title: "Non assignées",
      value: meta?.unassignedCount?.toString() || "0",
      trend: undefined,
      color: "warning" as const,
      icon: AlertCircle,
    },
    {
      title: "Temps de réponse",
      value: "~5 min",
      trend: "-12%",
      color: "success" as const,
      icon: Clock,
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Volume Chart - 2 columns */}
          <Card className="card-shadow lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Volume de messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageVolumeData}>
                    <defs>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F93FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1F93FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stroke="#1F93FF"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMessages)"
                      name="Messages reçus"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                      name="Résolus"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution - 1 column */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Statut des conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 -mt-4">
                  {statusDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Distribution */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Distribution par canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Pourcentage']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {channelDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Teams Distribution */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-secondary" />
                Équipes
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
                    <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
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
                        <Badge variant={team.allowAutoAssign ? "default" : "secondary"} className="text-xs">
                          {team.allowAutoAssign ? "Auto" : "Manuel"}
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
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors border border-transparent hover:border-border"
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
                          <Badge
                            variant={conv.status === 'open' ? 'default' : conv.status === 'resolved' ? 'secondary' : 'outline'}
                            className="text-xs px-1.5 py-0"
                          >
                            {conv.status === 'open' ? 'Ouvert' : conv.status === 'resolved' ? 'Résolu' : conv.status}
                          </Badge>
                          {conv.labels?.slice(0, 2).map((label) => (
                            <Badge
                              key={label}
                              variant="outline"
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
