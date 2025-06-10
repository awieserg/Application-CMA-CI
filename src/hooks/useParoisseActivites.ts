import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ActivitePastorale {
  id: string;
  paroisse_id: string;
  type: string;
  date: string;
  lieu: string;
  communaute?: string;
  commentaires?: string;
  autre_info?: string;
}

export const useParoisseActivites = (paroisseId: string) => {
  const queryClient = useQueryClient();

  const { data: activites, isLoading } = useQuery({
    queryKey: ['activites', paroisseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activites_pastorales')
        .select('*')
        .eq('paroisse_id', paroisseId);

      if (error) throw error;
      return data;
    },
    enabled: !!paroisseId,
  });

  const addActivite = useMutation({
    mutationFn: async (newActivite: Omit<ActivitePastorale, 'id'>) => {
      const { data, error } = await supabase
        .from('activites_pastorales')
        .insert([{ ...newActivite, paroisse_id: paroisseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activites', paroisseId] });
      toast.success('Activité ajoutée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout de l'activité: ${error.message}`);
    },
  });

  const updateActivite = useMutation({
    mutationFn: async ({ id, ...activite }: ActivitePastorale) => {
      const { data, error } = await supabase
        .from('activites_pastorales')
        .update(activite)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activites', paroisseId] });
      toast.success('Activité mise à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour de l'activité: ${error.message}`);
    },
  });

  const deleteActivite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activites_pastorales')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activites', paroisseId] });
      toast.success('Activité supprimée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression de l'activité: ${error.message}`);
    },
  });

  return {
    activites,
    isLoading,
    addActivite,
    updateActivite,
    deleteActivite,
  };
};