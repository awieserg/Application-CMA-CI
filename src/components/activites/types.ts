
import * as z from "zod";

export const activitePastoraleFormSchema = z.object({
  type: z.string().min(1, "Le type d'activité est requis"),
  date: z.date({
    required_error: "La date est requise",
  }),
  lieu: z.string().optional(),
  communaute: z.string().optional(),
  commentaires: z.string().optional(),
  autre_info: z.string().optional(),
});

export type ActivitePastoraleFormValues = z.infer<typeof activitePastoraleFormSchema>;

export interface ActivitePastoraleFormProps {
  control: any;
  paroisseId?: string;
}
