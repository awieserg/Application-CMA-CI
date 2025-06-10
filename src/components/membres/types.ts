
import * as z from "zod";

export const ministereOptions = [
  "Prédicateur",
  "Dirigeant de culte",
  "Traducteur",
  "Acteur de culte",
  "Chantre",
  "Membre du BE",
  "Membre du Conseil",
  "Ancien",
  "Diacre",
  "Responsable de ministère"
] as const;

export const membreFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenoms: z.string().min(2, "Les prénoms doivent contenir au moins 2 caractères"),
  dateNaissance: z.string().optional(),
  lieuNaissance: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide").default("info@cma.org"),
  adresse: z.string().optional(),
  profession: z.string().optional(),
  situationMatrimoniale: z.string().optional(),
  dateBapteme: z.string().optional(),
  lieuBapteme: z.string().optional(),
  dateAdhesion: z.string(),
  observations: z.string().optional(),
  ministeres: z.array(z.enum(ministereOptions)).default([]),
  communaute: z.string().optional(),
});

export type MembreFormValues = z.infer<typeof membreFormSchema>;

export interface MembreFormProps {
  control: any;
  paroisseId?: string;
}

// Ajout des types pour CommunauteMembresForm
export const communauteMembresFormSchema = z.object({
  communaute: z.string().min(1, "Veuillez sélectionner une communauté"),
  hommes: z.number().min(0, "Le nombre doit être positif"),
  femmes: z.number().min(0, "Le nombre doit être positif"),
  garcons: z.number().min(0, "Le nombre doit être positif"),
  filles: z.number().min(0, "Le nombre doit être positif"),
  dateRecensement: z.string(),
  observations: z.string().optional(),
});

export type CommunauteMembresFormValues = z.infer<typeof communauteMembresFormSchema>;

// Données de base pour les communautés
export const communautesMock = [
  { id: "1", nom: "Communauté 1" },
  { id: "2", nom: "Communauté 2" },
  { id: "3", nom: "Communauté 3" },
  { id: "4", nom: "Communauté 4" }
];
