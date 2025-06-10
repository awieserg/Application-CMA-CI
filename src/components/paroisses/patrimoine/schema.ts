
import * as z from "zod";

export const formSchema = z.object({
  designation: z.string().min(2, "La désignation est requise"),
  assetType: z.string().min(1, "Le type de bien est requis"),
  otherType: z.string().optional(),
  valeur: z.string().min(1, "La valeur est requise"),
  dateAcquisition: z.date().optional(),
  etat: z.string().min(1, "L'état est requis"),
  ownerType: z.enum(["paroisse", "communaute"]),
  communaute: z.string().optional(),
  emplacement: z.string().optional(),
  description: z.string().optional(),
  documents: z.array(z.any()).optional(),
});
