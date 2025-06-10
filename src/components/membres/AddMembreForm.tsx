
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InformationsPersonnelles } from "./sections/InformationsPersonnelles";
import { Contact } from "./sections/Contact";
import { InformationsEglise } from "./sections/InformationsEglise";
import { Button } from "@/components/ui/button";
import { Membre } from "@/hooks/useParoisseMembres";
import { MembreFormValues, membreFormSchema, ministereOptions } from "./types";
import { useEffect } from "react";

interface AddMembreFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MembreFormValues) => Promise<void>;
  isLoading?: boolean;
  paroisseId?: string;
  editData?: Membre | null;
}

export function AddMembreForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading,
  paroisseId,
  editData 
}: AddMembreFormProps) {
  const form = useForm<MembreFormValues>({
    resolver: zodResolver(membreFormSchema),
    defaultValues: {
      nom: "",
      prenoms: "",
      dateNaissance: "",
      lieuNaissance: "",
      telephone: "",
      email: "",
      adresse: "",
      profession: "",
      situationMatrimoniale: "",
      dateBapteme: "",
      lieuBapteme: "",
      dateAdhesion: "",
      observations: "",
      ministeres: [],
      communaute: "",
    },
  });

  useEffect(() => {
    if (editData) {
      // Filter and typecast the ministeres to ensure they match the allowed values
      const validMinisteres = Array.isArray(editData.ministeres) 
        ? editData.ministeres.filter(m => ministereOptions.includes(m as any)) as typeof ministereOptions[number][]
        : [];
      
      form.reset({
        nom: editData.nom,
        prenoms: editData.prenoms,
        dateNaissance: editData.date_naissance || "",
        lieuNaissance: editData.lieu_naissance || "",
        telephone: editData.telephone || "",
        email: editData.email || "",
        adresse: editData.adresse || "",
        profession: editData.profession || "",
        situationMatrimoniale: editData.situation_matrimoniale || "",
        dateBapteme: editData.date_bapteme || "",
        lieuBapteme: editData.lieu_bapteme || "",
        dateAdhesion: editData.date_adhesion || "",
        observations: editData.observations || "",
        ministeres: validMinisteres,
        communaute: editData.communaute || "",
      });
    } else {
      form.reset();
    }
  }, [editData, form]);

  const handleSubmit = async (data: MembreFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Modifier le membre" : "Ajouter un nouveau membre"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <InformationsPersonnelles control={form.control} />
              <Contact control={form.control} />
              <InformationsEglise control={form.control} paroisseId={paroisseId} />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? "Traitement..." : editData ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
