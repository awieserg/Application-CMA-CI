
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Phone, Mail, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data remains the same
const mockServiteurs = [
  {
    fullName: "Rév. Dr. Paul N'Goran",
    role: "Président National",
    entity: "CMA-CI",
    phones: ["+225 07 07 07 07 07", "+225 05 05 05 05 05"],
    email: "president@cma-ci.org"
  },
  {
    fullName: "Pasteur Konan Michel",
    role: "Secrétaire Général",
    entity: "CMA-CI",
    phones: ["+225 07 08 09 10 11"],
    email: "sg@cma-ci.org"
  }
];

// Get unique entities for filter
const uniqueEntities = [...new Set(mockServiteurs.map(s => s.entity))];

export const ServiteursAnnuaire = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");

  const filteredServiteurs = mockServiteurs.filter(serviteur => {
    const nameMatch = serviteur.fullName.toLowerCase().includes(searchName.toLowerCase());
    const entityMatch = !selectedEntity || serviteur.entity === selectedEntity;
    return nameMatch && entityMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annuaire National des Serviteurs de Dieu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par entité">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{selectedEntity || "Toutes les entités"}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entités</SelectItem>
                {uniqueEntities.map((entity) => (
                  <SelectItem key={entity} value={entity}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><User className="w-4 h-4 mr-2 inline" />Nom Complet</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Entité</TableHead>
              <TableHead><Phone className="w-4 h-4 mr-2 inline" />Contacts</TableHead>
              <TableHead><Mail className="w-4 h-4 mr-2 inline" />Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServiteurs.map((serviteur, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{serviteur.fullName}</TableCell>
                <TableCell>{serviteur.role}</TableCell>
                <TableCell>{serviteur.entity}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {serviteur.phones.map((phone, idx) => (
                      <div key={idx}>{phone}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{serviteur.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
