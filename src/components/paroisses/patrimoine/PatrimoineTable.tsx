
import React from 'react';
import { Patrimoine } from '@/hooks/useParoissePatrimoine';
import { PatrimoineTableRow } from './PatrimoineTableRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface PatrimoineTableProps {
  patrimoines: Patrimoine[];
  onUpdate: (patrimoine: Patrimoine) => void;
  onDelete: (id: string) => void;
}

export function PatrimoineTable({ patrimoines, onUpdate, onDelete }: PatrimoineTableProps) {
  if (!patrimoines || patrimoines.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg flex flex-col items-center justify-center text-muted-foreground space-y-2">
        <FileText className="h-12 w-12" />
        <p>Aucun patrimoine enregistré</p>
        <p className="text-sm">Les biens ajoutés apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[500px]">
        <div className="w-full">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Désignation</th>
                <th className="text-left p-2 font-medium">Type</th>
                <th className="text-right p-2 font-medium">Valeur</th>
                <th className="text-left p-2 font-medium">Date d'acquisition</th>
                <th className="text-left p-2 font-medium">État</th>
                <th className="text-left p-2 font-medium">Propriétaire</th>
                <th className="text-right p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patrimoines.map((patrimoine) => (
                <PatrimoineTableRow 
                  key={patrimoine.id} 
                  patrimoine={patrimoine} 
                  onUpdate={onUpdate} 
                  onDelete={onDelete} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
