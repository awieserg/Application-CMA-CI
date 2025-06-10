import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Phone, Mail, User, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Membre } from "@/hooks/useParoisseMembres";
import { toast } from "sonner";
import { ViewMembreDialog } from "@/components/membres/ViewMembreDialog";

export function MembersDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedParoisse, setSelectedParoisse] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState("nom");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMembre, setViewMembre] = useState<Membre | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Récupérer les membres de toutes les paroisses
  const { data: membres, isLoading } = useQuery({
    queryKey: ['all-membres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membres')
        .select('*, paroisses(nom)');

      if (error) {
        toast.error(`Erreur lors du chargement des membres: ${error.message}`);
        throw error;
      }
      return data as (Membre & { paroisses: { nom: string } })[];
    },
  });

  // Récupérer la liste des paroisses pour le filtre
  const { data: paroisses } = useQuery({
    queryKey: ['paroisses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paroisses')
        .select('id, nom');

      if (error) {
        toast.error(`Erreur lors du chargement des paroisses: ${error.message}`);
        return [];
      }
      return data;
    },
  });

  // Extraire tous les rôles uniques pour le filtre
  const uniqueRoles = membres 
    ? [...new Set(membres.filter(m => m.role).map(m => m.role))]
    : [];

  // Filtrer et trier les membres
  const filteredMembres = membres
    ? membres.filter(membre => {
        const nameMatch = `${membre.nom} ${membre.prenoms}`.toLowerCase().includes(searchQuery.toLowerCase());
        const roleMatch = selectedRole ? membre.role === selectedRole : true;
        const paroisseMatch = selectedParoisse ? membre.paroisse_id === selectedParoisse : true;
        return nameMatch && roleMatch && paroisseMatch;
      })
    : [];

  // Tri des membres
  const sortedMembres = [...filteredMembres].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === "nom") {
      valueA = `${a.nom} ${a.prenoms}`.toLowerCase();
      valueB = `${b.nom} ${b.prenoms}`.toLowerCase();
    } else if (sortField === "role") {
      valueA = a.role?.toLowerCase() || '';
      valueB = b.role?.toLowerCase() || '';
    } else if (sortField === "paroisse") {
      valueA = a.paroisses?.nom?.toLowerCase() || '';
      valueB = b.paroisses?.nom?.toLowerCase() || '';
    } else {
      valueA = a[sortField as keyof Membre]?.toString().toLowerCase() || '';
      valueB = b[sortField as keyof Membre]?.toString().toLowerCase() || '';
    }
    
    return sortDirection === "asc" 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Pagination
  const paginatedMembres = sortedMembres.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedMembres.length / itemsPerPage);

  // Fonction pour le tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Afficher le membre sélectionné
  const handleViewMembre = (membre: Membre) => {
    setViewMembre(membre);
    setViewDialogOpen(true);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les rôles</SelectItem>
              {uniqueRoles.map((role) => (
                role ? <SelectItem key={role} value={role}>{role}</SelectItem> : null
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[240px]">
          <Select value={selectedParoisse} onValueChange={setSelectedParoisse}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par paroisse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les paroisses</SelectItem>
              {paroisses?.map((paroisse) => (
                paroisse.id ? <SelectItem key={paroisse.id} value={paroisse.id}>{paroisse.nom}</SelectItem> : null
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("nom")}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> 
                  Nom
                  <SortIcon field="nom" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center">
                  Rôle
                  <SortIcon field="role" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("paroisse")}
              >
                <div className="flex items-center">
                  Paroisse
                  <SortIcon field="paroisse" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" /> 
                  Téléphone
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" /> 
                  Email
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Chargement des membres...
                </TableCell>
              </TableRow>
            ) : paginatedMembres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Aucun membre trouvé.
                </TableCell>
              </TableRow>
            ) : (
              paginatedMembres.map((membre) => (
                <TableRow key={membre.id}>
                  <TableCell className="font-medium">
                    {membre.nom} {membre.prenoms}
                  </TableCell>
                  <TableCell>{membre.role}</TableCell>
                  <TableCell>{membre.paroisses?.nom || "-"}</TableCell>
                  <TableCell>{membre.telephone || "-"}</TableCell>
                  <TableCell>{membre.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewMembre(membre)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      <ViewMembreDialog 
        membre={viewMembre}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
}
