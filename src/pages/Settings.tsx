import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Palette,
  Key,
  Globe,
  Shield,
  Save,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useProfile } from "@/hooks/useInboxes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Settings() {
  const { data: profile, isLoading } = useProfile();
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sound: true,
    desktop: true,
  });
  const [appearance, setAppearance] = useState({
    theme: "system",
    language: "fr",
    compactMode: false,
  });

  const copyApiKey = () => {
    const apiKey = import.meta.env.VITE_CHATWOOT_API_TOKEN || "••••••••••••••••";
    navigator.clipboard.writeText(apiKey);
    toast.success("Clé API copiée dans le presse-papiers");
  };

  const handleSave = () => {
    toast.success("Paramètres enregistrés avec succès");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et la configuration de votre compte
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="w-4 h-4" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Gérez les informations de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <img
                        src={profile?.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'user'}`}
                        alt={profile?.name || "Profil"}
                        className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{profile?.name || "Utilisateur"}</h3>
                        <p className="text-sm text-muted-foreground">{profile?.email || "email@example.com"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            profile?.availabilityStatus === 'online' ? 'bg-success' :
                            profile?.availabilityStatus === 'busy' ? 'bg-warning' : 'bg-muted'
                          }`} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {profile?.availabilityStatus || 'offline'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          defaultValue={profile?.name || ""}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={profile?.email || ""}
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Input
                          id="role"
                          defaultValue={profile?.role || "agent"}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications push sur mobile
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sons de notification</Label>
                      <p className="text-sm text-muted-foreground">
                        Jouer un son lors des nouvelles notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sound}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sound: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications bureau</Label>
                      <p className="text-sm text-muted-foreground">
                        Afficher des notifications sur le bureau
                      </p>
                    </div>
                    <Switch
                      checked={notifications.desktop}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, desktop: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Thème</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={(value) =>
                        setAppearance({ ...appearance, theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un thème" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <span className="flex items-center gap-2">
                            Clair
                          </span>
                        </SelectItem>
                        <SelectItem value="dark">
                          <span className="flex items-center gap-2">
                            Sombre
                          </span>
                        </SelectItem>
                        <SelectItem value="system">
                          <span className="flex items-center gap-2">
                            Système
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="grid gap-2">
                    <Label>
                      <Globe className="w-4 h-4 inline mr-2" />
                      Langue
                    </Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(value) =>
                        setAppearance({ ...appearance, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode compact</Label>
                      <p className="text-sm text-muted-foreground">
                        Réduire l'espacement pour afficher plus de contenu
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) =>
                        setAppearance({ ...appearance, compactMode: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <div className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Clé API
                  </CardTitle>
                  <CardDescription>
                    Utilisez cette clé pour accéder à l'API Chatwoot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={import.meta.env.VITE_CHATWOOT_API_TOKEN || "••••••••••••••••"}
                        readOnly
                        className="pr-20 font-mono bg-muted"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={copyApiKey}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ne partagez jamais votre clé API. Elle donne accès à toutes les données de votre compte.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configuration API
                  </CardTitle>
                  <CardDescription>
                    Informations de connexion à l'API Chatwoot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">URL de base</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {import.meta.env.VITE_CHATWOOT_BASE_URL || "https://app.chatwoot.com"}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">ID du compte</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {import.meta.env.VITE_CHATWOOT_ACCOUNT_ID || "1"}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">WebSocket</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {import.meta.env.VITE_CHATWOOT_WEBSOCKET_URL || "wss://app.chatwoot.com/cable"}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
