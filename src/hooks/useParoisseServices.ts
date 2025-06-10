import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceReligieux {
  id: string;
  paroisse_id: string;
  nom: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  jour: string;
  lieu: string;
  responsable: string;
  description?: string;
  communaute_id?: string;
}

export const useParoisseServices = (paroisseId: string) => {
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', paroisseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services_religieux')
        .select('*')
        .eq('paroisse_id', paroisseId);

      if (error) throw error;
      return data;
    },
    enabled: !!paroisseId,
  });

  const addService = useMutation({
    mutationFn: async (newService: Omit<ServiceReligieux, 'id'>) => {
      const { data, error } = await supabase
        .from('services_religieux')
        .insert([{ ...newService, paroisse_id: paroisseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', paroisseId] });
      toast.success('Service ajouté avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout du service: ${error.message}`);
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, ...service }: ServiceReligieux) => {
      const { data, error } = await supabase
        .from('services_religieux')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', paroisseId] });
      toast.success('Service mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour du service: ${error.message}`);
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services_religieux')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', paroisseId] });
      toast.success('Service supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du service: ${error.message}`);
    },
  });

  return {
    services,
    isLoading,
    addService,
    updateService,
    deleteService,
  };
};