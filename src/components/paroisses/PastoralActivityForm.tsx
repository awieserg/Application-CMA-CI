
import React from "react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InformationsActivite } from "@/components/activites/sections/InformationsActivite";
import { Commentaires } from "@/components/activites/sections/Commentaires";
import { ActivitePastoraleFormValues, activitePastoraleFormSchema } from "@/components/activites/types";
import { ActivitePastorale } from "@/hooks/useParoisseActivites";
import { toast } from "sonner";

interface PastoralActivityFormProps {
  paroisseId: string;
  onSubmit: UseMutateAsyncFunction<any, Error, any, unknown>;
  initialData?: ActivitePastorale | null;
  onOpenChange: (open: boolean) => void;
}

export const PastoralActivityForm: React.FC<PastoralActivityFormProps> = ({ 
  paroisseId, 
  onSubmit,
  initialData,
  onOpenChange
}) => {
  const form = useForm<ActivitePastoraleFormValues>({
    resolver: zodResolver(activitePastoraleFormSchema),
    defaultValues: {
      type: initialData?.type || "",
      lieu: initialData?.lieu || "",
      communaute: initialData?.communaute || "",
      date: initialData ? new Date(initialData.date) : new Date(),
      commentaires: initialData?.commentaires || "",
      autre_info: initialData?.autre_info || "",
    },
  });

  const handleSubmit = async (data: ActivitePastoraleFormValues) => {
    try {
      console.log("Soumission des données:", {
        ...data,
        date: data.date.toISOString(),
        paroisse_id: paroisseId,
        ...(initialData && { id: initialData.id }),
      });
      
      if (initialData) {
        await onSubmit({
          id: initialData.id,
          ...data,
          date: data.date.toISOString(),
          paroisse_id: paroisseId,
        });
        toast.success("Activité pastorale mise à jour avec succès");
      } else {
        await onSubmit({
          ...data,
          date: data.date.toISOString(),
          paroisse_id: paroisseId,
        });
        toast.success("Activité pastorale ajoutée avec succès");
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de l'enregistrement de l'activité");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <InformationsActivite control={form.control} paroisseId={paroisseId} />
          <Commentaires control={form.control} />
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-cma-blue">
            {initialData ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
