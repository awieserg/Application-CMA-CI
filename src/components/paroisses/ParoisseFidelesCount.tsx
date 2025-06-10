
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface MembreCommunaute {
  communaute: string;
  nombreMembres: number;
  dateRecensement: string;
}

interface ParoisseFidelesCountProps {
  membresCommunaute: MembreCommunaute[];
  totalMembres: number;
  onUpdate: () => void;
}

export const ParoisseFidelesCount: React.FC<ParoisseFidelesCountProps> = ({
  membresCommunaute,
  totalMembres,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">
          Nombre total de fidèles: {totalMembres}
        </h3>
        <Button onClick={onUpdate} className="bg-cma-blue hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" /> Mettre à jour
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Communauté</TableHead>
              <TableHead>Nombre de membres</TableHead>
              <TableHead>Date du recensement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membresCommunaute.length > 0 ? (
              membresCommunaute.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.communaute}</TableCell>
                  <TableCell>{item.nombreMembres}</TableCell>
                  <TableCell>
                    {new Date(item.dateRecensement).toLocaleDateString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  Aucun recensement de fidèles trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
