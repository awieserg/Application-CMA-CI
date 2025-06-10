
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ActivitePastorale } from '@/hooks/useParoisseActivites';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ParoisseActivitesTableProps {
  activites: ActivitePastorale[];
  onView: (activite: ActivitePastorale) => void;
  onEdit: (activite: ActivitePastorale) => void;
  onDelete: (activite: ActivitePastorale) => void;
}

export const ParoisseActivitesTable: React.FC<ParoisseActivitesTableProps> = ({
  activites,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border bg-white shadow-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Communauté</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activites.map((activite) => (
            <TableRow key={activite.id}>
              <TableCell className="font-medium">{activite.type}</TableCell>
              <TableCell>
                {format(new Date(activite.date), 'PPP', { locale: fr })}
              </TableCell>
              <TableCell>{activite.lieu}</TableCell>
              <TableCell>{activite.communaute || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => onView(activite)}
                    size="icon"
                    variant="outline"
                    className="bg-transparent text-green-700 border-green-400 hover:bg-green-50"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onEdit(activite)}
                    size="icon"
                    variant="outline"
                    className="bg-transparent text-blue-700 border-blue-400 hover:bg-blue-50"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(activite)}
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
