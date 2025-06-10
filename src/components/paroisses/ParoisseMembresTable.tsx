
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Membre } from '@/hooks/useParoisseMembres';

interface ParoisseMembresTableProps {
  membres: Membre[];
  onView: (membre: Membre) => void;
  onEdit: (membre: Membre) => void;
  onDelete: (membre: Membre) => void;
}

export const ParoisseMembresTable: React.FC<ParoisseMembresTableProps> = ({
  membres,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border bg-white shadow-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénoms</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date d'adhésion</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membres.map((membre) => (
            <TableRow key={membre.id}>
              <TableCell className="font-medium">{membre.nom}</TableCell>
              <TableCell>{membre.prenoms}</TableCell>
              <TableCell>{membre.role}</TableCell>
              <TableCell>{membre.telephone}</TableCell>
              <TableCell>{membre.date_adhesion ? new Date(membre.date_adhesion).toLocaleDateString("fr-FR") : 'Non spécifiée'}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => onView(membre)}
                    size="icon"
                    variant="outline"
                    className="bg-transparent text-green-700 border-green-400 hover:bg-green-50"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onEdit(membre)}
                    size="icon"
                    variant="outline"
                    className="bg-transparent text-blue-700 border-blue-400 hover:bg-blue-50"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(membre)}
                    size="icon"
                    variant="outline"
                    className="bg-transparent text-red-700 border-red-400 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
