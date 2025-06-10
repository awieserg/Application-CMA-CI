
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Patrimoine } from '@/hooks/useParoissePatrimoine';

interface PatrimoineTableRowProps {
  patrimoine: Patrimoine;
  onUpdate: (patrimoine: Patrimoine) => void;
  onDelete: (id: string) => void;
}

export function PatrimoineTableRow({ patrimoine, onUpdate, onDelete }: PatrimoineTableRowProps) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  const getEtatLabel = (etat: string) => {
    const etatMap = {
      'excellent': 'Excellent',
      'bon': 'Bon',
      'moyen': 'Moyen',
      'mauvais': 'Mauvais',
      'hors-service': 'Hors service',
      'na': 'Non applicable'
    };
    
    return etatMap[etat] || etat;
  };

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2 font-medium">{patrimoine.designation}</td>
      <td className="p-2 capitalize">{patrimoine.type}</td>
      <td className="p-2 text-right">{formatValue(patrimoine.valeur)} F</td>
      <td className="p-2">{format(new Date(patrimoine.date_acquisition), 'dd/MM/yyyy')}</td>
      <td className="p-2">{getEtatLabel(patrimoine.etat)}</td>
      <td className="p-2 capitalize">{patrimoine.proprietaire}</td>
      <td className="p-2 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(patrimoine)}
          >
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(patrimoine.id)}
          >
            Supprimer
          </Button>
        </div>
      </td>
    </tr>
  );
}
