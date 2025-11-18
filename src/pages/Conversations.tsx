import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationCard } from "@/components/conversations/ConversationCard";
import { MessageBubble } from "@/components/conversations/MessageBubble";
import { mockConversations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  CheckCircle2,
  UserPlus,
  ArrowRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Conversations() {
  const [activeConversationId, setActiveConversationId] = useState(mockConversations[0].id);
  const [messageInput, setMessageInput] = useState("");

  const activeConversation = mockConversations.find(c => c.id === activeConversationId);

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
              <Button variant="outline" size="sm" className="flex-1">
                Tous
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                Mes conv.
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {mockConversations.map((conv) => (
              <ConversationCard
                key={conv.id}
                contact={conv.contact}
                lastMessage={conv.lastMessage}
                timestamp={conv.timestamp}
                unreadCount={conv.unreadCount}
                tags={conv.tags}
                channel={conv.channel}
                isActive={conv.id === activeConversationId}
                onClick={() => setActiveConversationId(conv.id)}
              />
            ))}
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
                      src={activeConversation.contact.avatar}
                      alt={activeConversation.contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {activeConversation.contact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeConversation.contact.name}</h3>
                    <div className="flex items-center gap-2">
                      {activeConversation.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          className="text-xs px-1.5 py-0 border-0"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Résoudre
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
                {activeConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    content={message.content}
                    sender={message.sender}
                    timestamp={message.timestamp}
                    avatar={message.sender === 'agent' 
                      ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent'
                      : activeConversation.contact.avatar || ''
                    }
                    status={message.status}
                  />
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Écrivez votre message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-primary hover:bg-primary-hover">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Appuyez sur Ctrl+Entrée pour envoyer
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez une conversation</p>
            </div>
          )}
        </div>

        {/* Right Column - Contact Details */}
        <div className="w-80 flex flex-col bg-card rounded-lg border border-border card-shadow overflow-y-auto">
          {activeConversation && (
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="text-center">
                <img
                  src={activeConversation.contact.avatar}
                  alt={activeConversation.contact.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <h3 className="font-semibold text-lg mb-1">{activeConversation.contact.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{activeConversation.contact.email}</p>
                {activeConversation.contact.phone && (
                  <p className="text-sm text-muted-foreground">{activeConversation.contact.phone}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {activeConversation.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      className="px-2 py-1 border-0"
                    >
                      {tag.label}
                      {tag.isAutomatic && <span className="ml-1 text-xs">(Auto)</span>}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-7">
                    + Ajouter
                  </Button>
                </div>
              </div>

              {/* Team Assignment */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Équipe & Routage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Équipe assignée</span>
                    <Badge variant="outline">{activeConversation.assignedTeam}</Badge>
                  </div>
                  {activeConversation.assignedAgent && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Agent</span>
                      <span className="text-sm font-medium">{activeConversation.assignedAgent}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <Badge 
                      variant="secondary"
                      className={
                        activeConversation.status === 'open' 
                          ? 'bg-success/20 text-success' 
                          : activeConversation.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {activeConversation.status === 'open' ? 'Ouvert' : 
                       activeConversation.status === 'pending' ? 'En attente' : 'Résolu'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Activité</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total conversations</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Première interaction</span>
                    <span className="font-medium">15 mars 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canal préféré</span>
                    <span className="font-medium capitalize">{activeConversation.channel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
