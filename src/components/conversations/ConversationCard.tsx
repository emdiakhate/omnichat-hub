import { Contact, Tag } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Facebook, Mail, MessageCircle, Instagram, Twitter } from "lucide-react";

interface ConversationCardProps {
  contact: Contact;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  tags: Tag[];
  channel: 'facebook' | 'email' | 'whatsapp' | 'instagram' | 'twitter';
  isActive: boolean;
  onClick: () => void;
}

const channelIcons = {
  facebook: Facebook,
  email: Mail,
  whatsapp: MessageCircle,
  instagram: Instagram,
  twitter: Twitter,
};

export const ConversationCard = ({
  contact,
  lastMessage,
  timestamp,
  unreadCount,
  tags,
  channel,
  isActive,
  onClick,
}: ConversationCardProps) => {
  const ChannelIcon = channelIcons[channel];

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
            src={contact.avatar}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {contact.isOnline && (
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
                {contact.name}
              </h3>
              {tags.length > 0 && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: tags[0].color + '20', color: tags[0].color }}
                  className="text-xs px-1.5 py-0 border-0"
                >
                  {tags[0].label}
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

          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
