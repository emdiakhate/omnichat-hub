import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationCard } from "@/components/conversations/ConversationCard";
import { MessageBubble } from "@/components/conversations/MessageBubble";
import { ConversationFiltersComponent } from "@/components/conversations/ConversationFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCircle2,
  UserPlus,
  Loader2,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Calendar,
  Hash,
  RefreshCw,
  Archive,
  Ban,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useToggleStatus
} from "@/hooks/useConversations";
import {
  ConversationCardSkeleton,
  LoadingSpinner,
  ErrorState,
  EmptyState
} from "@/components/ui/loading-states";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Message, ConversationFilters } from "@/api/types";

// Emoji categories
const EMOJI_CATEGORIES = {
  "Smileys": ["😀", "😊", "😂", "🥰", "😎", "🤔", "😅", "😍", "🥺", "😢", "😤", "🤗"],
  "Gestures": ["👍", "👎", "👋", "🙏", "👏", "🤝", "💪", "✌️", "🤞", "👌", "🙌", "🎉"],
  "Hearts": ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "💝", "💖", "💗", "💓", "💕"],
  "Objects": ["📧", "📞", "💻", "📱", "⏰", "📅", "✅", "❌", "⭐", "🔥", "💡", "🎯"],
};

export default function Conversations() {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [filters, setFilters] = useState<ConversationFilters>({ status: 'open' });
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Insert emoji at cursor position
  const insertEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setIsEmojiOpen(false);
    inputRef.current?.focus();
  };

  // Fetch conversations list
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations
  } = useConversations(filters);

  // Fetch messages for active conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = useMessages(activeConversationId);

  // Mutations
  const sendMessageMutation = useSendMessage();
  const toggleStatusMutation = useToggleStatus();

  // Extract data
  const conversations = conversationsData?.data?.payload || [];
  const messages = messagesData?.payload || [];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Set first conversation as active when list loads
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return;

    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      payload: {
        content: messageInput,
        messageType: 'outgoing',
        private: false
      }
    }, {
      onSuccess: () => {
        setMessageInput("");
      }
    });
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSendMessage();
    }
  };

  // Resolve conversation handler
  const handleResolve = () => {
    if (!activeConversationId) return;

    toggleStatusMutation.mutate({
      conversationId: activeConversationId,
      payload: { status: 'resolved' }
    });
  };

  // Get sender info from conversation
  const sender = activeConversation?.meta?.sender;
  const assignee = activeConversation?.meta?.assignee;

  return (
    <MainLayout>
      <div className="h-[calc(100vh-7rem)] flex gap-4">
        {/* Left Column - Conversations List */}
        <div className="w-96 flex flex-col bg-card rounded-lg border border-border card-shadow">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                Nouvelle
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button
                variant={!filters.status || filters.status === 'open' ? "default" : "ghost"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, status: 'open' })}
              >
                Ouverts
              </Button>
              <Button
                variant={filters.assigneeType === 'me' ? "default" : "ghost"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({
                  ...filters,
                  assigneeType: filters.assigneeType === 'me' ? undefined : 'me'
                })}
              >
                Mes conv.
              </Button>
              <ConversationFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversationsLoading ? (
              <>
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
                <ConversationCardSkeleton />
              </>
            ) : conversationsError ? (
              <div className="p-4">
                <ErrorState
                  message="Erreur de chargement"
                  onRetry={() => refetchConversations()}
                />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onClick={() => setActiveConversationId(conv.id)}
                />
              ))
            ) : (
              <EmptyState
                title="Aucune conversation"
                description="Les nouvelles conversations apparaîtront ici"
              />
            )}
          </div>
        </div>

        {/* Center Column - Messages */}
        <div className="flex-1 flex flex-col bg-card rounded-lg border border-border card-shadow">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={sender?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || activeConversation.id}`}
                      alt={sender?.name || 'Contact'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {sender?.availabilityStatus === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{sender?.name || `Contact #${activeConversation.id}`}</h3>
                    <div className="flex items-center gap-2">
                      {activeConversation.labels?.map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleResolve}
                    disabled={toggleStatusMutation.isPending || activeConversation.status === 'resolved'}
                  >
                    {toggleStatusMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {activeConversation.status === 'resolved' ? 'Résolu' : 'Résoudre'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Assigner
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem className="cursor-pointer">Transférer</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Marquer comme spam</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-danger">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : messagesError ? (
                  <ErrorState
                    message="Erreur de chargement des messages"
                    onRetry={() => refetchMessages()}
                  />
                ) : messages.length > 0 ? (
                  <>
                    {messages.map((message: Message) => (
                      <MessageBubble
                        key={message.id}
                        content={message.content || ''}
                        sender={message.messageType === 1 ? 'agent' : 'contact'}
                        timestamp={new Date(message.createdAt * 1000)}
                        avatar={
                          message.messageType === 1
                            ? message.sender?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent'
                            : sender?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || 'contact'}`
                        }
                        status={message.status === 'read' ? 'read' : message.status === 'delivered' ? 'sent' : 'sent'}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <EmptyState
                    title="Aucun message"
                    description="Démarrez la conversation en envoyant un message"
                  />
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-2">
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Paperclip className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Joindre un fichier</TooltipContent>
                    </Tooltip>
                    <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Smile className="w-5 h-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-3" align="start">
                        <div className="space-y-3">
                          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                            <div key={category}>
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                {category}
                              </p>
                              <div className="grid grid-cols-6 gap-1">
                                {emojis.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => insertEmoji(emoji)}
                                    className="p-2 hover:bg-accent rounded-md text-lg transition-colors"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      placeholder="Écrivez votre message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="min-h-[40px] max-h-[120px] resize-none pr-12"
                      disabled={sendMessageMutation.isPending}
                      rows={1}
                    />
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary-hover h-9"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Appuyez sur Ctrl+Entrée pour envoyer
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Contact Details */}
        <div className="w-80 flex flex-col bg-card rounded-lg border border-border card-shadow overflow-y-auto">
          {activeConversation && (
            <div className="p-4 space-y-4">
              {/* Contact Info */}
              <div className="text-center pb-4 border-b border-border">
                <div className="relative inline-block">
                  <img
                    src={sender?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || activeConversation.id}`}
                    alt={sender?.name || 'Contact'}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 ring-4 ring-primary/10"
                  />
                  {sender?.availabilityStatus === 'online' && (
                    <span className="absolute bottom-3 right-0 w-4 h-4 bg-success border-2 border-card rounded-full" />
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1">{sender?.name || `Contact #${activeConversation.id}`}</h3>
                <div className="space-y-1">
                  {sender?.email && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {sender.email}
                    </div>
                  )}
                  {sender?.phoneNumber && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {sender.phoneNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation Status */}
              <div className="pb-4 border-b border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Statut</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-accent/50 rounded-lg text-center">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        activeConversation.status === 'open'
                          ? 'bg-success/20 text-success'
                          : activeConversation.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {activeConversation.status === 'open' ? 'Ouvert' :
                       activeConversation.status === 'pending' ? 'En attente' :
                       activeConversation.status === 'resolved' ? 'Résolu' :
                       activeConversation.status === 'snoozed' ? 'Mis en pause' : activeConversation.status}
                    </Badge>
                  </div>
                  <div className="p-2 bg-accent/50 rounded-lg text-center">
                    <span className="text-xs text-muted-foreground">Non lus</span>
                    <p className="font-semibold text-sm">{activeConversation.unreadCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="pb-4 border-b border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Labels</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeConversation.labels && activeConversation.labels.length > 0 ? (
                    <>
                      {activeConversation.labels.map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs"
                        >
                          {label}
                        </Badge>
                      ))}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun label</span>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                    + Ajouter
                  </Button>
                </div>
              </div>

              {/* Assignment */}
              <div className="pb-4 border-b border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Assignation</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <UserPlus className="w-3 h-3" />
                      Agent
                    </span>
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={assignee.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee.name}`}
                          alt={assignee.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs font-medium">{assignee.name}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">Non assigné</Badge>
                    )}
                  </div>
                  {activeConversation.meta?.team && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Équipe</span>
                      <Badge variant="outline" className="text-xs">{activeConversation.meta.team.name}</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="pb-4 border-b border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Détails</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      ID Conversation
                    </span>
                    <span className="font-mono">{activeConversation.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      ID Inbox
                    </span>
                    <span className="font-mono">{activeConversation.inboxId}</span>
                  </div>
                  {activeConversation.meta?.channel && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Canal</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activeConversation.meta.channel.replace('Channel::', '')}
                      </Badge>
                    </div>
                  )}
                  {activeConversation.priority && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Priorité</span>
                      <Badge variant="outline" className="text-xs">{activeConversation.priority}</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Activité</h4>
                <div className="space-y-2 text-xs">
                  {activeConversation.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Créé
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(activeConversation.createdAt * 1000), { locale: fr, addSuffix: true })}
                      </span>
                    </div>
                  )}
                  {activeConversation.lastActivityAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Dernière activité
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(activeConversation.lastActivityAt * 1000), { locale: fr, addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
