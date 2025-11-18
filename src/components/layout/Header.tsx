import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebSocketIndicator } from "@/components/ui/websocket-indicator";
import { useWebSocket } from "@/providers/WebSocketProvider";

export const Header = () => {
  const { isConnected } = useWebSocket();

  return (
    <header className="fixed top-0 right-0 left-60 h-16 border-b border-border bg-card/80 backdrop-blur-sm z-10">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher conversations, contacts..."
              className="pl-9 bg-background border-border"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* WebSocket Status */}
          <WebSocketIndicator isConnected={isConnected} />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Nouveau message de Sophie Martin</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Conversation assignée à votre équipe</p>
                  <p className="text-xs text-muted-foreground">Il y a 15 minutes</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">3 messages non lus</p>
                  <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Jean Dupont</p>
                  <p className="text-xs text-muted-foreground font-normal">jean@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Mon profil</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Aide</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-danger">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
