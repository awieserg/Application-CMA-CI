import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RecensementFideles {
  id: string;
  paroisse_id: string;
  communaute: string;
  nombre_membres: number;
  date_recensement: string;
}

export const useParoisseFideles = (paroisseId: string) => {
  const queryClient = useQueryClient();

  const { data: recensements, isLoading } = useQuery({
    queryKey: ['recensements', paroisseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recensement_fideles')
        .select('*')
        .eq('paroisse_id', paroisseId);

      if (error) throw error;
      
      // Process data to get only the latest entry per community
      const communityMap = new Map();
      
      // Sort by date (newest first)
      const sortedData = [...data].sort((a, b) => 
        new Date(b.date_recensement).getTime() - new Date(a.date_recensement).getTime()
      );
      
      // Keep only the latest entry for each community
      sortedData.forEach(entry => {
        if (!communityMap.has(entry.communaute)) {
          communityMap.set(entry.communaute, entry);
        }
      });
      
      // Convert map values back to array
      return Array.from(communityMap.values());
    },
    enabled: !!paroisseId,
  });

  const addRecensement = useMutation({
    mutationFn: async (newRecensement: Omit<RecensementFideles, 'id'>) => {
      const { data, error } = await supabase
        .from('recensement_fideles')
        .insert([{ ...newRecensement, paroisse_id: paroisseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recensements', paroisseId] });
      toast.success('Recensement ajouté avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout du recensement: ${error.message}`);
    },
  });

  const updateRecensement = useMutation({
    mutationFn: async ({ id, ...recensement }: RecensementFideles) => {
      const { data, error } = await supabase
        .from('recensement_fideles')
        .update(recensement)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recensements', paroisseId] });
      toast.success('Recensement mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour du recensement: ${error.message}`);
    },
  });

  return {
    recensements,
    isLoading,
    addRecensement,
    updateRecensement,
  };
};