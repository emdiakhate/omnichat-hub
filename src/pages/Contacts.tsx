import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Download, Mail, Phone, MoreVertical, Users, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContacts, useSearchContacts, useDeleteContact } from "@/hooks/useContacts";
import {
  ContactRowSkeleton,
  ErrorState,
  EmptyState
} from "@/components/ui/loading-states";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Contact } from "@/api/types";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contacts
  const {
    data: contactsData,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts
  } = useContacts();

  // Search contacts (enabled when search query exists)
  const {
    data: searchData,
    isLoading: searchLoading
  } = useSearchContacts(searchQuery);

  // Delete mutation
  const deleteContactMutation = useDeleteContact();

  // Use search results if searching, otherwise use all contacts
  const contacts = searchQuery.length > 0
    ? (searchData?.payload || [])
    : (contactsData?.payload || []);

  const totalCount = contactsData?.meta?.count || contacts.length;

  const handleDelete = (contactId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      deleteContactMutation.mutate(contactId);
    }
  };

  const isLoading = contactsLoading || (searchQuery.length > 0 && searchLoading);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Contacts</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Chargement...' : `${totalCount} contacts au total`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4" />
              Ajouter contact
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un contact..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">Filtres</Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border card-shadow">
          {contactsError ? (
            <div className="p-6">
              <ErrorState
                message="Erreur lors du chargement des contacts"
                onRetry={() => refetchContacts()}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    <TableRow><TableCell colSpan={7} className="p-0"><ContactRowSkeleton /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={7} className="p-0"><ContactRowSkeleton /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={7} className="p-0"><ContactRowSkeleton /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={7} className="p-0"><ContactRowSkeleton /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={7} className="p-0"><ContactRowSkeleton /></TableCell></TableRow>
                  </>
                ) : contacts.length > 0 ? (
                  contacts.map((contact: Contact) => (
                    <TableRow key={contact.id} className="hover:bg-accent/50 cursor-pointer">
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={contact.thumbnail || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name || contact.id}`}
                              alt={contact.name || 'Contact'}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {contact.availabilityStatus === 'online' && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{contact.name || `Contact #${contact.id}`}</p>
                            {contact.identifier && (
                              <p className="text-xs text-muted-foreground">{contact.identifier}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.email ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.phoneNumber ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {contact.phoneNumber}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={contact.availabilityStatus === 'online' ? 'bg-success/20 text-success' : 'bg-muted'}
                        >
                          {contact.availabilityStatus === 'online' ? 'En ligne' : 'Hors ligne'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.lastActivityAt
                          ? formatDistanceToNow(new Date(contact.lastActivityAt * 1000), { locale: fr, addSuffix: true })
                          : 'Pas d\'activité'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem className="cursor-pointer">Voir détails</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Démarrer conversation</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Modifier</DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-danger"
                              onClick={() => handleDelete(contact.id)}
                            >
                              {deleteContactMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="py-12">
                        <EmptyState
                          title={searchQuery ? "Aucun résultat" : "Aucun contact"}
                          description={searchQuery
                            ? `Aucun contact trouvé pour "${searchQuery}"`
                            : "Les contacts apparaîtront ici"
                          }
                          action={
                            !searchQuery && (
                              <Button className="bg-primary hover:bg-primary-hover">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un contact
                              </Button>
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
