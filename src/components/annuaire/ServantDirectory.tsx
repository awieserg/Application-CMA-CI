
import { useState } from "react";
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
import { Phone, Mail, User, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiteurInfo } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ServantDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewServant, setViewServant] = useState<ServiteurInfo | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch regions data
  const { data: regions } = useQuery({
    queryKey: ['servant-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch districts data
  const { data: districts } = useQuery({
    queryKey: ['servant-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select(`
          *,
          regions (nom)
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch paroisses data
  const { data: paroisses } = useQuery({
    queryKey: ['servant-paroisses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paroisses')
        .select(`
          *,
          districts (
            nom,
            regions (nom)
          )
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create a list of servants from the fetched data
  const serviteurs: ServiteurInfo[] = [];
  
  // Add region superintendents
  regions?.forEach(region => {
    if (region.surintendant) {
      serviteurs.push({
        id: `region-${region.id}`,
        fullName: region.surintendant,
        role: "Surintendant Régional",
        entity: region.nom,
        phones: ["+225 XX XX XX XX XX"],
        email: `surintendant.${region.code.toLowerCase()}@cma-ci.org`,
        region: region.nom
      });
    }
  });

  // Add district superintendents
  districts?.forEach(district => {
    if (district.surintendant) {
      serviteurs.push({
        id: `district-${district.id}`,
        fullName: district.surintendant,
        role: "Surintendant de District",
        entity: district.nom,
        phones: ["+225 XX XX XX XX XX"],
        email: `district.${district.code.toLowerCase()}@cma-ci.org`,
        region: district.regions?.nom || "Inconnu"
      });
    }
  });

  // Add parish pastors
  paroisses?.forEach(paroisse => {
    if (paroisse.pasteur) {
      serviteurs.push({
        id: `paroisse-${paroisse.id}`,
        fullName: paroisse.pasteur,
        role: "Pasteur Principal",
        entity: paroisse.nom,
        phones: ["+225 XX XX XX XX XX"],
        email: `paroisse.${paroisse.code.toLowerCase()}@cma-ci.org`,
        region: paroisse.districts?.regions?.nom || "Inconnu"
      });
    }
  });

  // Add national leadership (hard-coded for now as this might not be in the database)
  serviteurs.push(
    {
      id: "national-1",
      fullName: "Rév. Dr. Paul N'Goran",
      role: "Président National",
      entity: "CMA-CI",
      phones: ["+225 07 07 07 07 07"],
      email: "president@cma-ci.org",
      region: "Siège National"
    },
    {
      id: "national-2",
      fullName: "Pasteur Konan Michel",
      role: "Secrétaire Général",
      entity: "CMA-CI",
      phones: ["+225 07 08 09 10 11"],
      email: "sg@cma-ci.org",
      region: "Siège National"
    }
  );

  // Extraire tous les rôles uniques pour le filtre
  const uniqueRoles = [...new Set(serviteurs.map(s => s.role))];
  
  // Extraire toutes les régions uniques pour le filtre
  const uniqueRegions = [...new Set(serviteurs.map(s => s.region))];

  // Filtrer les serviteurs
  const filteredServiteurs = serviteurs.filter(serviteur => {
    const nameMatch = serviteur.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = selectedRole ? serviteur.role === selectedRole : true;
    const regionMatch = selectedRegion ? serviteur.region === selectedRegion : true;
    return nameMatch && roleMatch && regionMatch;
  });

  // Tri des serviteurs
  const sortedServiteurs = [...filteredServiteurs].sort((a, b) => {
    let valueA = a[sortField as keyof ServiteurInfo]?.toString().toLowerCase() || '';
    let valueB = b[sortField as keyof ServiteurInfo]?.toString().toLowerCase() || '';
    
    return sortDirection === "asc" 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Pagination
  const paginatedServiteurs = sortedServiteurs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedServiteurs.length / itemsPerPage);

  // Fonction pour le tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Afficher le serviteur sélectionné
  const handleViewServant = (serviteur: ServiteurInfo) => {
    setViewServant(serviteur);
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
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[240px]">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les régions</SelectItem>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
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
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> 
                  Nom Complet
                  <SortIcon field="fullName" />
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
                onClick={() => handleSort("entity")}
              >
                <div className="flex items-center">
                  Entité
                  <SortIcon field="entity" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("region")}
              >
                <div className="flex items-center">
                  Région
                  <SortIcon field="region" />
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
            {paginatedServiteurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Aucun serviteur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              paginatedServiteurs.map((serviteur) => (
                <TableRow key={serviteur.id}>
                  <TableCell className="font-medium">
                    {serviteur.fullName}
                  </TableCell>
                  <TableCell>{serviteur.role}</TableCell>
                  <TableCell>{serviteur.entity}</TableCell>
                  <TableCell>{serviteur.region}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {serviteur.phones.map((phone, idx) => (
                        <div key={idx}>{phone}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{serviteur.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewServant(serviteur)}
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

      {/* Dialogue pour afficher les détails du serviteur */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Détails du serviteur</DialogTitle>
          </DialogHeader>
          {viewServant && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">Informations personnelles</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nom complet:</span> {viewServant.fullName}</p>
                  <p><span className="font-medium">Rôle:</span> {viewServant.role}</p>
                  <p><span className="font-medium">Entité:</span> {viewServant.entity}</p>
                  <p><span className="font-medium">Région:</span> {viewServant.region}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Téléphone(s):</span>
                    {viewServant.phones.map((phone, idx) => (
                      <p key={idx}>{phone}</p>
                    ))}
                  </div>
                  <p><span className="font-medium">Email:</span> {viewServant.email || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
