import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tag,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from "@/hooks/useLabels";
import { ErrorState } from "@/components/ui/loading-states";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Label as LabelType } from "@/api/types";

// Preset colors for labels
const PRESET_COLORS = [
  "#1F93FF", // Blue
  "#7C3AED", // Purple
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

interface LabelFormData {
  title: string;
  description: string;
  color: string;
  showOnSidebar: boolean;
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-border"
          style={{ backgroundColor: value }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
              value === color ? "ring-2 ring-offset-2 ring-primary" : ""
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteLabelId, setDeleteLabelId] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<LabelType | null>(null);
  const [formData, setFormData] = useState<LabelFormData>({
    title: "",
    description: "",
    color: PRESET_COLORS[0],
    showOnSidebar: true,
  });

  const { data: labels, isLoading, error, refetch } = useLabels();
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabelMutation = useDeleteLabel();

  const filteredLabels = (Array.isArray(labels) ? labels : []).filter((label: LabelType) =>
    label.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    label.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error("Le nom du tag est requis");
      return;
    }

    try {
      await createLabel.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        color: formData.color,
        showOnSidebar: formData.showOnSidebar,
      });
      toast.success("Tag créé avec succès");
      setIsCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        color: PRESET_COLORS[0],
        showOnSidebar: true,
      });
    } catch (error) {
      toast.error("Erreur lors de la création du tag");
    }
  };

  const handleEdit = async () => {
    if (!selectedLabel || !formData.title.trim()) return;

    try {
      await updateLabel.mutateAsync({
        labelId: selectedLabel.id,
        payload: {
          title: formData.title,
          description: formData.description || undefined,
          color: formData.color,
          showOnSidebar: formData.showOnSidebar,
        },
      });
      toast.success("Tag modifié avec succès");
      setIsEditOpen(false);
      setSelectedLabel(null);
    } catch (error) {
      toast.error("Erreur lors de la modification du tag");
    }
  };

  const handleDelete = async () => {
    if (!deleteLabelId) return;

    try {
      await deleteLabelMutation.mutateAsync(deleteLabelId);
      toast.success("Tag supprimé avec succès");
      setDeleteLabelId(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression du tag");
    }
  };

  const openEditDialog = (label: LabelType) => {
    setSelectedLabel(label);
    setFormData({
      title: label.title,
      description: label.description || "",
      color: label.color || PRESET_COLORS[0],
      showOnSidebar: label.showOnSidebar ?? true,
    });
    setIsEditOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
            <p className="text-muted-foreground">
              Gérez vos tags pour organiser les conversations et contacts
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer un tag</DialogTitle>
                <DialogDescription>
                  Créez un nouveau tag pour organiser vos données
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Nom du tag</Label>
                  <Input
                    id="title"
                    placeholder="Ex: VIP Client"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description du tag..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>
                    <Palette className="w-4 h-4 inline mr-2" />
                    Couleur
                  </Label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => setFormData({ ...formData, color })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showOnSidebar">Afficher dans la sidebar</Label>
                    <p className="text-xs text-muted-foreground">
                      Rendre ce tag visible dans la barre latérale
                    </p>
                  </div>
                  <Switch
                    id="showOnSidebar"
                    checked={formData.showOnSidebar}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, showOnSidebar: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate} disabled={createLabel.isPending}>
                  {createLabel.isPending ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tags Table */}
        {isLoading ? (
          <Card className="card-shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Visibilité</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </TableBody>
            </Table>
          </Card>
        ) : error ? (
          <ErrorState
            message="Erreur lors du chargement des tags"
            onRetry={() => refetch()}
          />
        ) : filteredLabels.length > 0 ? (
          <Card className="card-shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Visibilité</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabels.map((label: LabelType) => (
                  <TableRow key={label.id} className="group">
                    <TableCell>
                      <Badge
                        className="font-medium"
                        style={{
                          backgroundColor: label.color || PRESET_COLORS[0],
                          color: "#fff",
                        }}
                      >
                        {label.title}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {label.description || "-"}
                    </TableCell>
                    <TableCell>
                      {label.showOnSidebar ? (
                        <span className="flex items-center gap-1 text-sm text-success">
                          <Eye className="w-4 h-4" />
                          Visible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <EyeOff className="w-4 h-4" />
                          Masqué
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(label)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteLabelId(label.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="card-shadow">
            <CardContent className="p-12 text-center">
              <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucun tag</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Aucun tag ne correspond à votre recherche"
                  : "Créez votre premier tag pour organiser vos conversations"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un tag
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le tag</DialogTitle>
              <DialogDescription>
                Modifiez les informations du tag
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Nom du tag</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
              <div className="grid gap-2">
                <Label>
                  <Palette className="w-4 h-4 inline mr-2" />
                  Couleur
                </Label>
                <ColorPicker
                  value={formData.color}
                  onChange={(color) => setFormData({ ...formData, color })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-showOnSidebar">Afficher dans la sidebar</Label>
                  <p className="text-xs text-muted-foreground">
                    Rendre ce tag visible dans la barre latérale
                  </p>
                </div>
                <Switch
                  id="edit-showOnSidebar"
                  checked={formData.showOnSidebar}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showOnSidebar: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEdit} disabled={updateLabel.isPending}>
                {updateLabel.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteLabelId}
          onOpenChange={() => setDeleteLabelId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le tag ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le tag sera définitivement
                supprimé de toutes les conversations et contacts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLabelMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
