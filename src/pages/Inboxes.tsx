import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Settings,
  Facebook,
  Mail,
  MessageCircle,
  Instagram,
  Twitter,
  Globe,
  Phone,
  MessageSquare,
  Inbox
} from "lucide-react";
import { useInboxes } from "@/hooks/useInboxes";
import {
  InboxCardSkeleton,
  ErrorState,
  EmptyState
} from "@/components/ui/loading-states";
import type { Inbox as InboxType } from "@/api/types";

// Map channel types to icons and colors
const channelConfig: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, color: string }> = {
  'Channel::WebWidget': { icon: Globe, color: '#6366F1' },
  'Channel::Api': { icon: MessageSquare, color: '#8B5CF6' },
  'Channel::Email': { icon: Mail, color: '#EA4335' },
  'Channel::FacebookPage': { icon: Facebook, color: '#1877F2' },
  'Channel::Whatsapp': { icon: MessageCircle, color: '#25D366' },
  'Channel::Sms': { icon: Phone, color: '#10B981' },
  'Channel::Telegram': { icon: MessageCircle, color: '#0088cc' },
  'Channel::Line': { icon: MessageCircle, color: '#00C300' },
  'Channel::TwitterProfile': { icon: Twitter, color: '#1DA1F2' },
};

export default function Inboxes() {
  const {
    data: inboxes,
    isLoading,
    error,
    refetch
  } = useInboxes();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Boîtes de réception</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Chargement...' : `${inboxes?.length || 0} boîtes configurées`}
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            Ajouter une boîte
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            message="Erreur lors du chargement des boîtes de réception"
            onRetry={() => refetch()}
          />
        )}

        {/* Inboxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <InboxCardSkeleton />
              <InboxCardSkeleton />
              <InboxCardSkeleton />
            </>
          ) : inboxes && inboxes.length > 0 ? (
            inboxes.map((inbox: InboxType) => {
              const config = channelConfig[inbox.channelType] || { icon: Inbox, color: '#6B7280' };
              const Icon = config.icon;
              const color = config.color;

              return (
                <Card key={inbox.id} className="hover-lift card-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: color + '20' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: color }} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{inbox.name}</CardTitle>
                          <Badge
                            variant="secondary"
                            className="bg-success/20 text-success mt-1"
                          >
                            Connecté
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Type de canal</span>
                        <span className="font-medium text-sm">
                          {inbox.channelType.replace('Channel::', '')}
                        </span>
                      </div>
                      {inbox.greetingEnabled && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Accueil</span>
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            Actif
                          </Badge>
                        </div>
                      )}
                      {inbox.enableAutoAssignment && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Auto-assign</span>
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            Activé
                          </Badge>
                        </div>
                      )}
                      {inbox.workingHoursEnabled && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Heures ouvrées</span>
                          <Badge variant="secondary">
                            Configuré
                          </Badge>
                        </div>
                      )}
                      <div className="pt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Settings className="w-4 h-4" />
                          Configurer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : !error && (
            <div className="col-span-full">
              <EmptyState
                title="Aucune boîte de réception"
                description="Configurez votre première boîte de réception pour commencer"
                action={
                  <Button className="bg-primary hover:bg-primary-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une boîte
                  </Button>
                }
              />
            </div>
          )}
        </div>

        {/* Add Inbox CTA */}
        {!isLoading && !error && (
          <Card className="card-shadow border-dashed border-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ajouter une nouvelle boîte de réception</h3>
              <p className="text-muted-foreground mb-4">
                Connectez vos canaux de communication (Facebook, Email, WhatsApp, etc.)
              </p>
              <Button className="bg-primary hover:bg-primary-hover">
                Commencer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
