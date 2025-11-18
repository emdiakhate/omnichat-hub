import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  sender: 'agent' | 'contact';
  timestamp: Date;
  avatar: string;
  status: 'sending' | 'sent' | 'read';
}

export const MessageBubble = ({
  content,
  sender,
  timestamp,
  avatar,
  status,
}: MessageBubbleProps) => {
  const isAgent = sender === 'agent';

  return (
    <div className={cn("flex gap-3 mb-4", isAgent && "flex-row-reverse")}>
      {/* Avatar */}
      <img
        src={avatar}
        alt={sender}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      {/* Message bubble */}
      <div className={cn("flex flex-col gap-1", isAgent ? "items-end" : "items-start")}>
        <div
          className={cn(
            "max-w-md px-4 py-2.5 rounded-2xl",
            isAgent
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Timestamp and status */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">
            {format(timestamp, 'HH:mm', { locale: fr })}
          </span>
          {isAgent && (
            <span className={cn("text-muted-foreground", status === 'read' && "text-primary")}>
              {status === 'sending' && <Check className="w-3 h-3" />}
              {status === 'sent' && <CheckCheck className="w-3 h-3" />}
              {status === 'read' && <CheckCheck className="w-3 h-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
