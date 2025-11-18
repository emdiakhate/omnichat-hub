import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Facebook, Mail, MessageCircle, Instagram, Twitter } from "lucide-react";

const inboxes = [
  {
    id: '1',
    name: 'Facebook Messenger',
    icon: Facebook,
    color: '#1877F2',
    status: 'connected',
    messagesCount: 45,
    unassigned: 8,
    avgResponseTime: 3.2,
  },
  {
    id: '2',
    name: 'Email Support',
    icon: Mail,
    color: '#EA4335',
    status: 'connected',
    messagesCount: 127,
    unassigned: 23,
    avgResponseTime: 12.5,
  },
  {
    id: '3',
    name: 'WhatsApp Business',
    icon: MessageCircle,
    color: '#25D366',
    status: 'connected',
    messagesCount: 89,
    unassigned: 5,
    avgResponseTime: 2.8,
  },
  {
    id: '4',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    status: 'disconnected',
    messagesCount: 0,
    unassigned: 0,
    avgResponseTime: 0,
  },
];

export default function Inboxes() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Boîtes de réception</h1>
            <p className="text-muted-foreground">Gérez vos canaux de communication</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            Ajouter une boîte
          </Button>
        </div>

        {/* Inboxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inboxes.map((inbox) => {
            const Icon = inbox.icon;
            return (
              <Card key={inbox.id} className="hover-lift card-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: inbox.color + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: inbox.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{inbox.name}</CardTitle>
                        <Badge 
                          variant="secondary"
                          className={inbox.status === 'connected' 
                            ? 'bg-success/20 text-success mt-1' 
                            : 'bg-muted text-muted-foreground mt-1'
                          }
                        >
                          {inbox.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Messages aujourd'hui</span>
                      <span className="font-semibold">{inbox.messagesCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Non assignés</span>
                      <Badge variant="secondary" className="bg-warning/20 text-warning">
                        {inbox.unassigned}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Temps de réponse</span>
                      <span className="font-semibold">{inbox.avgResponseTime} min</span>
                    </div>
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
          })}
        </div>

        {/* Add Inbox CTA */}
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
      </div>
    </MainLayout>
  );
}
