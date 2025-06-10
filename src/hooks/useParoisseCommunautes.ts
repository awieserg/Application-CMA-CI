
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Communaute {
  id: string;
  paroisse_id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export const useParoisseCommunautes = (paroisseId: string) => {
  const { data: communautes, isLoading, error } = useQuery({
    queryKey: ['communautes', paroisseId],
    queryFn: async () => {
      if (!paroisseId) {
        return [];
      }
      
      console.log("Fetching communautes for paroisse:", paroisseId);
      
      try {
        const { data, error } = await supabase
          .from('communautes')
          .select('*')
          .eq('paroisse_id', paroisseId);

        if (error) {
          console.error('Error fetching communautes:', error);
          throw error;
        }

        console.log("Communautes fetched:", data);
        return data as Communaute[];
      } catch (err) {
        console.error('Exception in communautes query:', err);
        throw err;
      }
    },
    enabled: !!paroisseId,
    retry: 1,
    refetchOnWindowFocus: false
  });

  return {
    communautes,
    isLoading,
    error
  };
};
