
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Patrimoine {
  id: string;
  paroisse_id: string;
  designation: string;
  type: string;
  valeur: number;
  date_acquisition: string;
  etat: string;
  proprietaire: string;
  documents?: string[];
}

export const useParoissePatrimoine = (paroisseId: string) => {
  const queryClient = useQueryClient();

  const { data: patrimoines, isLoading } = useQuery({
    queryKey: ['patrimoines', paroisseId],
    queryFn: async () => {
      console.log("Fetching patrimoines for paroisse:", paroisseId);
      if (!paroisseId) return [];
      
      try {
        const { data, error } = await supabase
          .from('patrimoines')
          .select('*')
          .eq('paroisse_id', paroisseId);

        if (error) {
          console.error("Error fetching patrimoines:", error);
          throw error;
        }
        
        console.log("Patrimoines fetched:", data);
        return data;
      } catch (err) {
        console.error("Exception in patrimoines query:", err);
        throw err;
      }
    },
    enabled: !!paroisseId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const addPatrimoine = useMutation({
    mutationFn: async (newPatrimoine: Omit<Patrimoine, 'id'>) => {
      console.log("Adding patrimoine:", newPatrimoine);
      
      const { data, error } = await supabase
        .from('patrimoines')
        .insert([{ ...newPatrimoine, paroisse_id: paroisseId }])
        .select()
        .single();

      if (error) {
        console.error("Error adding patrimoine:", error);
        throw error;
      }
      
      console.log("Patrimoine added successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimoines', paroisseId] });
      toast.success('Bien ajouté avec succès');
    },
    onError: (error: Error) => {
      console.error("Error in onError callback:", error);
      toast.error(`Erreur lors de l'ajout du bien: ${error.message}`);
    },
  });

  const updatePatrimoine = useMutation({
    mutationFn: async ({ id, ...patrimoine }: Patrimoine) => {
      const { data, error } = await supabase
        .from('patrimoines')
        .update(patrimoine)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimoines', paroisseId] });
      toast.success('Bien mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour du bien: ${error.message}`);
    },
  });

  const deletePatrimoine = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('patrimoines')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimoines', paroisseId] });
      toast.success('Bien supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du bien: ${error.message}`);
    },
  });

  return {
    patrimoines,
    isLoading,
    addPatrimoine,
    updatePatrimoine,
    deletePatrimoine,
  };
};
