// WebSocket Connection Status Indicator
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebSocketIndicatorProps {
  isConnected: boolean;
  className?: string;
}

export function WebSocketIndicator({ isConnected, className }: WebSocketIndicatorProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-md text-xs",
            isConnected
              ? "text-success"
              : "text-muted-foreground",
            className
          )}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <Wifi className="h-3 w-3" />
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
              <WifiOff className="h-3 w-3" />
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isConnected ? 'Connecté en temps réel' : 'Déconnecté du temps réel'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
