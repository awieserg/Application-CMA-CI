
import * as z from "zod";

export const serviceReligieuxFormSchema = z.object({
  nom: z.string().min(1, "Le nom du service est requis"),
  jour: z.string().min(1, "Le jour est requis"),
  date: z.string().min(1, "La date est requise"),
  heure_debut: z.string().min(1, "L'heure de début est requise"),
  heure_fin: z.string().min(1, "L'heure de fin est requise"),
  lieu: z.string().optional(),
  communaute_id: z.string().optional(),
  responsable: z.string().optional(),
  description: z.string().optional(),
  paroisse_id: z.string()
});

export type ServiceReligieuxFormValues = z.infer<typeof serviceReligieuxFormSchema>;

export interface ServiceReligieuxFormProps {
  paroisseId: string;
  initialData?: ServiceReligieux | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceReligieuxFormValues) => Promise<void>;
}

export interface ServiceReligieux {
  id: string;
  nom: string;
  jour: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  communaute_id?: string;
  responsable: string;
  description?: string;
  paroisse_id: string;
}
