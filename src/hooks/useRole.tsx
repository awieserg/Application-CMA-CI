import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { UserRole } from "@/types/auth";

export type { UserRole };

export const useRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      return "president" as UserRole; // En développement local, toujours retourner president
    },
    initialData: "president" as UserRole
  });
};

export const ROLE_LABELS: Record<UserRole, string> = {
  president: "Président",
  secretary_general: "Secrétaire Général",
  director: "Directeur",
  assistant_director: "Directeur Adjoint",
  region_superintendent: "Surintendant Régional",
  district_superintendent: "Surintendant de District",
  parish_intendant: "Intendant de Paroisse",
  community_pastor: "Pasteur de Communauté",
  missionary: "Missionnaire",
  chaplain: "Aumônier",
  assistant_pastor: "Assistant Pasteur",
  technical_assistant: "Assistant Technique",
  visitor: "Visiteur"
};