
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ParoisseHeaderProps {
  paroisseId?: string;
}

export const ParoisseHeader: React.FC<ParoisseHeaderProps> = ({ paroisseId }) => {
  const { data: paroisse, isLoading } = useQuery({
    queryKey: ['paroisse', paroisseId],
    queryFn: async () => {
      if (!paroisseId) return null;
      
      const { data, error } = await supabase
        .from('paroisses')
        .select(`
          *,
          districts (
            nom,
            regions (
              nom
            )
          )
        `)
        .eq('id', paroisseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!paroisseId
  });

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (!paroisse) {
    return (
      <div>
        <span className="text-gray-500">Veuillez sélectionner une paroisse</span>
      </div>
    );
  }

  return (
    <div>
      <span className="text-cma-blue font-bold text-2xl">{paroisse.nom}</span>
      <p className="text-sm text-gray-500 mt-1">
        {paroisse.districts?.nom}, {paroisse.districts?.regions?.nom} | 
        Pasteur: {paroisse.pasteur || 'Non assigné'}
      </p>
    </div>
  );
};
