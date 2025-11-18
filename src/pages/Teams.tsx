import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  UserPlus,
  Settings2,
  Search,
} from "lucide-react";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam, useAgents, useTeamMembers } from "@/hooks/useInboxes";
import { ErrorState } from "@/components/ui/loading-states";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Team, Agent } from "@/api/types";

interface TeamFormData {
  name: string;
  description: string;
  allowAutoAssign: boolean;
}

function TeamCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembersDialog({ team, agents }: { team: Team; agents: Agent[] }) {
  const { data: members, isLoading } = useTeamMembers(team.id);

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Membres de {team.name}</DialogTitle>
        <DialogDescription>
          Gérez les agents assignés à cette équipe
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {members.map((member: Agent) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-card rounded-full ${
                        member.availabilityStatus === 'online'
                          ? 'bg-success'
                          : member.availabilityStatus === 'busy'
                          ? 'bg-warning'
                          : 'bg-muted'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Badge variant={member.role === 'administrator' ? 'default' : 'secondary'}>
                  {member.role === 'administrator' ? 'Admin' : 'Agent'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun membre dans cette équipe</p>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter des membres
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    allowAutoAssign: false,
  });

  const { data: teams, isLoading, error, refetch } = useTeams();
  const { data: agents } = useAgents();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const filteredTeams = teams?.filter((team: Team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom de l'équipe est requis");
      return;
    }

    try {
      await createTeam.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        allowAutoAssign: formData.allowAutoAssign,
      });
      toast.success("Équipe créée avec succès");
      setIsCreateOpen(false);
      setFormData({ name: "", description: "", allowAutoAssign: false });
    } catch (error) {
      toast.error("Erreur lors de la création de l'équipe");
    }
  };

  const handleEdit = async () => {
    if (!selectedTeam || !formData.name.trim()) return;

    try {
      await updateTeam.mutateAsync({
        teamId: selectedTeam.id,
        payload: {
          name: formData.name,
          description: formData.description || undefined,
          allowAutoAssign: formData.allowAutoAssign,
        },
      });
      toast.success("Équipe modifiée avec succès");
      setIsEditOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      toast.error("Erreur lors de la modification de l'équipe");
    }
  };

  const handleDelete = async () => {
    if (!deleteTeamId) return;

    try {
      await deleteTeamMutation.mutateAsync(deleteTeamId);
      toast.success("Équipe supprimée avec succès");
      setDeleteTeamId(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'équipe");
    }
  };

  const openEditDialog = (team: Team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      description: team.description || "",
      allowAutoAssign: team.allowAutoAssign || false,
    });
    setIsEditOpen(true);
  };

  const openMembersDialog = (team: Team) => {
    setSelectedTeam(team);
    setIsMembersOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Équipes</h1>
            <p className="text-muted-foreground">
              Gérez vos équipes et leurs membres
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer une équipe</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle équipe pour organiser vos agents
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de l'équipe</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Support Client"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description de l'équipe..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAssign">Auto-assignation</Label>
                    <p className="text-xs text-muted-foreground">
                      Assigner automatiquement les conversations
                    </p>
                  </div>
                  <Switch
                    id="autoAssign"
                    checked={formData.allowAutoAssign}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowAutoAssign: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate} disabled={createTeam.isPending}>
                  {createTeam.isPending ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TeamCardSkeleton />
            <TeamCardSkeleton />
            <TeamCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            message="Erreur lors du chargement des équipes"
            onRetry={() => refetch()}
          />
        ) : filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team: Team) => (
              <Card key={team.id} className="card-shadow hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {team.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {team.description || "Aucune description"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openMembersDialog(team)}>
                          <Users className="w-4 h-4 mr-2" />
                          Voir les membres
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(team)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTeamId(team.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Settings2 className="w-4 h-4" />
                      <span>ID: {team.id}</span>
                    </div>
                    <Badge
                      variant={team.allowAutoAssign ? "default" : "secondary"}
                    >
                      {team.allowAutoAssign ? "Auto-assign" : "Manuel"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-shadow">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucune équipe</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Aucune équipe ne correspond à votre recherche"
                  : "Créez votre première équipe pour organiser vos agents"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une équipe
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier l'équipe</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'équipe
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom de l'équipe</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-autoAssign">Auto-assignation</Label>
                  <p className="text-xs text-muted-foreground">
                    Assigner automatiquement les conversations
                  </p>
                </div>
                <Switch
                  id="edit-autoAssign"
                  checked={formData.allowAutoAssign}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, allowAutoAssign: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEdit} disabled={updateTeam.isPending}>
                {updateTeam.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Members Dialog */}
        <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
          {selectedTeam && agents && (
            <TeamMembersDialog team={selectedTeam} agents={agents} />
          )}
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteTeamId}
          onOpenChange={() => setDeleteTeamId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer l'équipe ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'équipe sera définitivement
                supprimée et tous les membres seront retirés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteTeamMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
