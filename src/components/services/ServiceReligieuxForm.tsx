
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceReligieuxFormProps, ServiceReligieuxFormValues, serviceReligieuxFormSchema } from "./types";
import { useParoisseServices } from "@/hooks/useParoisseServices";

const joursSemaine = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" }
];

export const ServiceReligieuxForm: React.FC<ServiceReligieuxFormProps> = ({
  paroisseId,
  initialData,
  onOpenChange,
  onSubmit,
}) => {
  const { addService, updateService } = useParoisseServices(paroisseId);
  
  const form = useForm<ServiceReligieuxFormValues>({
    resolver: zodResolver(serviceReligieuxFormSchema),
    defaultValues: {
      nom: initialData?.nom || "",
      jour: initialData?.jour || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
      heure_debut: initialData?.heure_debut || "",
      heure_fin: initialData?.heure_fin || "",
      lieu: initialData?.lieu || "",
      communaute_id: initialData?.communaute_id || "",
      responsable: initialData?.responsable || "",
      description: initialData?.description || "",
      paroisse_id: paroisseId
    },
  });

  const handleSubmit = async (data: ServiceReligieuxFormValues) => {
    try {
      console.log("Form submission data:", data);
      
      const serviceData = {
        ...data,
        paroisse_id: paroisseId,
      };
      
      if (initialData && initialData.id) {
        // Update existing service - ensure all required fields are present
        await updateService.mutateAsync({
          id: initialData.id,
          nom: serviceData.nom,
          jour: serviceData.jour,
          date: serviceData.date,
          heure_debut: serviceData.heure_debut,
          heure_fin: serviceData.heure_fin,
          lieu: serviceData.lieu,
          responsable: serviceData.responsable,
          paroisse_id: serviceData.paroisse_id,
          description: serviceData.description || "",
          communaute_id: serviceData.communaute_id || "",
        });
      } else {
        // Create new service - ensure all required fields are present
        await addService.mutateAsync({
          nom: serviceData.nom,
          jour: serviceData.jour,
          date: serviceData.date,
          heure_debut: serviceData.heure_debut,
          heure_fin: serviceData.heure_fin,
          lieu: serviceData.lieu,
          responsable: serviceData.responsable,
          paroisse_id: serviceData.paroisse_id,
          description: serviceData.description || "",
          communaute_id: serviceData.communaute_id || "",
        });
      }
      
      form.reset();
      if (onSubmit) {
        await onSubmit(serviceData);
      }
    } catch (error) {
      console.error("Error submitting service data:", error);
    }
  };

  useEffect(() => {
    if (onOpenChange) {
      const submitHandler = form.handleSubmit(handleSubmit);
      (window as any).__serviceFormSubmit = submitHandler;
    }
  }, [form, onOpenChange]);

  const isLoading = initialData ? updateService.isPending : addService.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du service */}
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du service</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Culte du dimanche" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jour de la semaine */}
          <FormField
            control={form.control}
            name="jour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jour</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un jour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {joursSemaine.map((jour) => (
                      <SelectItem key={jour.value} value={jour.value}>
                        {jour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Heure de début */}
          <FormField
            control={form.control}
            name="heure_debut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de début</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Heure de fin */}
          <FormField
            control={form.control}
            name="heure_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lieu */}
          <FormField
            control={form.control}
            name="lieu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Temple principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsable */}
          <FormField
            control={form.control}
            name="responsable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsable</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Pasteur Martin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description du service religieux" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? initialData
                ? "Mise à jour..."
                : "Enregistrement..."
              : initialData
              ? "Mettre à jour"
              : "Enregistrer"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
