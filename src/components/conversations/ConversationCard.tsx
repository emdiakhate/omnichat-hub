import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Facebook, Mail, MessageCircle, Instagram, Twitter, Globe, Phone, MessageSquare } from "lucide-react";
import type { Conversation, ContactSender } from "@/api/types";

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Channel::WebWidget': Globe,
  'Channel::Api': MessageSquare,
  'Channel::Email': Mail,
  'Channel::FacebookPage': Facebook,
  'Channel::Whatsapp': MessageCircle,
  'Channel::Sms': Phone,
  'Channel::Telegram': MessageCircle,
  'Channel::Line': MessageCircle,
  'Channel::TwitterProfile': Twitter,
  'facebook': Facebook,
  'email': Mail,
  'whatsapp': MessageCircle,
  'instagram': Instagram,
  'twitter': Twitter,
};

export const ConversationCard = ({
  conversation,
  isActive,
  onClick,
}: ConversationCardProps) => {
  const sender = conversation.meta?.sender;
  const channel = conversation.meta?.channel || 'Channel::WebWidget';
  const ChannelIcon = channelIcons[channel] || MessageSquare;

  const lastMessage = conversation.lastNonActivityMessage?.content ||
    conversation.messages?.[0]?.content ||
    'Pas de message';

  const timestamp = conversation.lastActivityAt
    ? new Date(conversation.lastActivityAt * 1000)
    : new Date();

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg cursor-pointer transition-all border",
        "hover:bg-accent/50 hover:shadow-sm",
        isActive ? "bg-accent border-primary shadow-sm" : "bg-card border-border"
      )}
    >
      <div className="flex gap-3">
        {/* Avatar with status */}
        <div className="relative flex-shrink-0">
          <img
            src={sender?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || conversation.id}`}
            alt={sender?.name || 'Contact'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {sender?.availabilityStatus === 'online' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card rounded-full flex items-center justify-center">
            <ChannelIcon className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {sender?.name || `Contact #${conversation.id}`}
              </h3>
              {conversation.labels && conversation.labels.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {conversation.labels[0]}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(timestamp, { locale: fr, addSuffix: true })}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {lastMessage}
          </p>

          <div className="flex items-center gap-2">
            {conversation.unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                {conversation.unreadCount} nouveau{conversation.unreadCount > 1 ? 'x' : ''}
              </Badge>
            )}
            {conversation.status && conversation.status !== 'open' && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  conversation.status === 'resolved' && "bg-success/20 text-success",
                  conversation.status === 'pending' && "bg-warning/20 text-warning",
                  conversation.status === 'snoozed' && "bg-muted"
                )}
              >
                {conversation.status === 'resolved' ? 'Résolu' :
                 conversation.status === 'pending' ? 'En attente' :
                 conversation.status === 'snoozed' ? 'Mis en pause' : conversation.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
