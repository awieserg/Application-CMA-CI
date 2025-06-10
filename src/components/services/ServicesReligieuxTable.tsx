
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceReligieux } from "@/hooks/useParoisseServices";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesReligieuxTableProps {
  services: ServiceReligieux[];
  onEdit?: (service: ServiceReligieux) => void;
  onDelete?: (service: ServiceReligieux) => void;
}

export const ServicesReligieuxTable: React.FC<ServicesReligieuxTableProps> = ({
  services,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Jour</TableHead>
            <TableHead>Horaires</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Aucun service religieux enregistré
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.nom}</TableCell>
                <TableCell>{service.jour}</TableCell>
                <TableCell>{service.heure_debut} - {service.heure_fin}</TableCell>
                <TableCell>{service.lieu}</TableCell>
                <TableCell>{service.responsable || "-"}</TableCell>
                <TableCell className="text-right space-x-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(service)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(service)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
