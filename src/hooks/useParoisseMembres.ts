import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Membre {
  id: string;
  paroisse_id: string;
  nom: string;
  prenoms: string;
  role: string;
  telephone: string | null;
  email: string | null;
  date_adhesion: string;
  communaute: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  adresse: string | null;
  profession: string | null;
  situation_matrimoniale: string | null;
  date_bapteme: string | null;
  lieu_bapteme: string | null;
  ministeres: string[] | null;
  observations: string | null;
}

export const useParoisseMembres = (paroisseId: string) => {
  const queryClient = useQueryClient();

  const { data: membres, isLoading } = useQuery({
    queryKey: ['membres', paroisseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membres')
        .select('*')
        .eq('paroisse_id', paroisseId);

      if (error) {
        toast.error(`Erreur lors du chargement des membres: ${error.message}`);
        throw error;
      }
      return data;
    },
    enabled: !!paroisseId,
  });

  const addMembre = useMutation({
    mutationFn: async (newMembre: any) => {
      const { data, error } = await supabase
        .from('membres')
        .upsert([{
          id: newMembre.id, // This will be undefined for new membres
          paroisse_id: paroisseId,
          nom: newMembre.nom,
          prenoms: newMembre.prenoms,
          date_naissance: newMembre.dateNaissance || null,
          lieu_naissance: newMembre.lieuNaissance || null,
          telephone: newMembre.telephone || null,
          email: newMembre.email || null,
          adresse: newMembre.adresse || null,
          profession: newMembre.profession || null,
          situation_matrimoniale: newMembre.situationMatrimoniale || null,
          date_bapteme: newMembre.dateBapteme || null,
          lieu_bapteme: newMembre.lieuBapteme || null,
          date_adhesion: newMembre.dateAdhesion,
          observations: newMembre.observations || null,
          ministeres: newMembre.ministeres,
          communaute: newMembre.communaute || null,
          role: determineRole(newMembre.ministeres)
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membres', paroisseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout/modification du membre: ${error.message}`);
    },
  });

  // Adding updateMembre as an alias to addMembre for consistency with the interface
  const updateMembre = addMembre;

  const deleteMembre = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('membres')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membres', paroisseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du membre: ${error.message}`);
    },
  });

  return {
    membres,
    isLoading,
    addMembre,
    updateMembre,
    deleteMembre,
  };
};

const determineRole = (ministeres: string[]): string => {
  if (ministeres.includes("Ancien")) return "Ancien";
  if (ministeres.includes("Diacre")) return "Diacre";
  if (ministeres.includes("Responsable de ministère")) return "Responsable";
  return "Membre";
};