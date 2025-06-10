
import { z } from "zod";
import { formSchema } from "./schema";

export const ASSET_TYPES = [
  { value: "terrain", label: "Terrain", icon: "Building" },
  { value: "maison", label: "Maison", icon: "Building" },
  { value: "batiment", label: "Bâtiment", icon: "Building" },
  { value: "vehicule", label: "Véhicule", icon: "Car" },
  { value: "mobilier", label: "Mobilier", icon: "FolderOpen" },
  { value: "materiel", label: "Matériel", icon: "FolderOpen" },
  { value: "document", label: "Document", icon: "FileText" },
  { value: "autre", label: "Autre", icon: "FileText" },
];

export type PatrimoineFormValues = z.infer<typeof formSchema>;

export interface PatrimoineSubmitData {
  paroisse_id: string;
  designation: string;
  type: string;
  valeur: number;
  date_acquisition: string;
  etat: string;
  proprietaire: string;
  documents?: string[];
}
