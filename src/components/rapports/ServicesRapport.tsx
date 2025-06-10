
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceReligieux } from "@/hooks/useParoisseServices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface ServicesRapportProps {
  services: ServiceReligieux[];
}

export function ServicesRapport({ services }: ServicesRapportProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Apply day filter
      if (filter !== "all" && service.jour !== filter) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          service.nom.toLowerCase().includes(query) ||
          service.lieu.toLowerCase().includes(query) ||
          service.responsable.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [services, filter, searchQuery]);
  
  // Stats calculations
  const totalServices = services.length;
  const servicesByDay = useMemo(() => {
    const counts = {};
    services.forEach(service => {
      counts[service.jour] = (counts[service.jour] || 0) + 1;
    });
    return counts;
  }, [services]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Rapport des Services Religieux</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par jour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les jours</SelectItem>
                <SelectItem value="lundi">Lundi</SelectItem>
                <SelectItem value="mardi">Mardi</SelectItem>
                <SelectItem value="mercredi">Mercredi</SelectItem>
                <SelectItem value="jeudi">Jeudi</SelectItem>
                <SelectItem value="vendredi">Vendredi</SelectItem>
                <SelectItem value="samedi">Samedi</SelectItem>
                <SelectItem value="dimanche">Dimanche</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total des services</p>
              <p className="text-xl font-bold">{totalServices}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Services dominicaux</p>
              <p className="text-xl font-bold">{servicesByDay["dimanche"] || 0}</p>
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lieux distincts</p>
              <p className="text-xl font-bold">
                {new Set(services.map(s => s.lieu)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du service</TableHead>
                <TableHead>Jour</TableHead>
                <TableHead>Horaires</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    {filter !== "all" || searchQuery 
                      ? "Aucun service ne correspond aux critères de recherche"
                      : "Aucun service religieux n'a été enregistré"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.nom}</TableCell>
                    <TableCell className="capitalize">{service.jour}</TableCell>
                    <TableCell>{service.heure_debut} - {service.heure_fin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        {service.lieu}
                      </div>
                    </TableCell>
                    <TableCell>{service.responsable || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
