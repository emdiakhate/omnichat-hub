// API Connection Test Page
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile, useInboxes, useAgents, useTeams } from "@/hooks/useInboxes";
import { useConversations, useConversationsMeta } from "@/hooks/useConversations";
import { useContacts } from "@/hooks/useContacts";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface TestResultProps {
  name: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: unknown;
}

function TestResult({ name, isLoading, isError, error, data }: TestResultProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        ) : isError ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {isLoading && <Badge variant="secondary">Chargement...</Badge>}
        {isError && (
          <Badge variant="destructive" className="text-xs">
            {error?.message || "Erreur"}
          </Badge>
        )}
        {!isLoading && !isError && data && (
          <Badge variant="default" className="bg-green-600">
            OK {Array.isArray(data) ? `(${data.length})` : ""}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function ApiTest() {
  const queryClient = useQueryClient();

  // Test all API endpoints
  const profile = useProfile();
  const inboxes = useInboxes();
  const agents = useAgents();
  const teams = useTeams();
  const conversations = useConversations({ status: "open" });
  const conversationsMeta = useConversationsMeta();
  const contacts = useContacts();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  const allTests = [
    { name: "Profile (Utilisateur actuel)", ...profile },
    { name: "Inboxes (Boîtes de réception)", ...inboxes },
    { name: "Agents", ...agents },
    { name: "Teams (Équipes)", ...teams },
    { name: "Conversations", ...conversations },
    { name: "Conversations Meta", ...conversationsMeta },
    { name: "Contacts", ...contacts },
  ];

  const successCount = allTests.filter(t => !t.isLoading && !t.isError && t.data).length;
  const errorCount = allTests.filter(t => t.isError).length;
  const loadingCount = allTests.filter(t => t.isLoading).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test de Connexion API Chatwoot</h1>
        <p className="text-muted-foreground">
          Vérification que le token API fonctionne correctement
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configuration</CardTitle>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Base URL:</span>
              <p className="font-mono text-xs break-all">
                {import.meta.env.VITE_CHATWOOT_BASE_URL || "Non défini"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Account ID:</span>
              <p className="font-mono">{import.meta.env.VITE_CHATWOOT_ACCOUNT_ID || "1"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Token:</span>
              <p className="font-mono">
                {import.meta.env.VITE_CHATWOOT_API_TOKEN
                  ? `${import.meta.env.VITE_CHATWOOT_API_TOKEN.substring(0, 8)}...`
                  : "Non défini"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            Résumé des Tests
            <div className="flex gap-2">
              {loadingCount > 0 && (
                <Badge variant="secondary">{loadingCount} en cours</Badge>
              )}
              {successCount > 0 && (
                <Badge className="bg-green-600">{successCount} succès</Badge>
              )}
              {errorCount > 0 && (
                <Badge variant="destructive">{errorCount} erreurs</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allTests.map((test) => (
            <TestResult
              key={test.name}
              name={test.name}
              isLoading={test.isLoading}
              isError={test.isError}
              error={test.error as Error | null}
              data={test.data}
            />
          ))}
        </CardContent>
      </Card>

      {/* Show actual data if available */}
      {profile.data && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Données du Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(profile.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {conversationsMeta.data && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Métriques des Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(conversationsMeta.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {inboxes.data && (
        <Card>
          <CardHeader>
            <CardTitle>Inboxes ({(inboxes.data as unknown[]).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(inboxes.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
