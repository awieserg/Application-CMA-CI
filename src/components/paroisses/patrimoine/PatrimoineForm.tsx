import React, { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ASSET_TYPES, PatrimoineFormValues, PatrimoineSubmitData } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { DocumentUpload } from "./DocumentUpload";
import { formSchema } from "./schema";
import { DateAcquisitionField } from "./DateAcquisitionField";

interface PatrimoineFormProps {
  paroisseId: string;
  onSubmit: (data: PatrimoineSubmitData) => void;
  initialData?: PatrimoineFormValues | null;
  onOpenChange: (open: boolean) => void;
}

export const PatrimoineForm: React.FC<PatrimoineFormProps> = ({ 
  paroisseId, 
  onSubmit, 
  initialData, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [isOtherType, setIsOtherType] = useState(initialData?.assetType === "autre");
  const [documentUrls, setDocumentUrls] = useState<string[]>(initialData?.documentUrls || []);

  const form = useForm<PatrimoineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designation: initialData?.designation || "",
      assetType: initialData?.assetType || "",
      otherType: initialData?.otherType || "",
      valeur: initialData?.valeur || "",
      dateAcquisition: initialData?.dateAcquisition || new Date(),
      etat: initialData?.etat || "",
      ownerType: initialData?.ownerType || "paroisse",
      communaute: initialData?.communaute || "",
      emplacement: initialData?.emplacement || "",
      description: initialData?.description || "",
      documentUrls: initialData?.documentUrls || [],
    },
  });

  const handleAssetTypeChange = useCallback((value: string) => {
    setIsOtherType(value === "autre");
  }, []);

  const handleDocumentsChange = (urls: string[]) => {
    setDocumentUrls(urls);
  };

  const handleSubmit = async (values: PatrimoineFormValues) => {
    try {
      if (!paroisseId) {
        toast({
          title: "Erreur!",
          description: "ID de la paroisse requis.",
          variant: "destructive",
        });
        return;
      }

      const type = values.assetType === "autre" ? values.otherType : values.assetType;
      if (!type) {
        toast({
          title: "Erreur!",
          description: "Veuillez spécifier le type d'actif.",
          variant: "destructive",
        });
        return;
      }

      const patrimoineData: PatrimoineSubmitData = {
        paroisse_id: paroisseId,
        designation: values.designation,
        type,
        valeur: parseFloat(values.valeur),
        date_acquisition: format(values.dateAcquisition, 'yyyy-MM-dd'),
        etat: values.etat,
        proprietaire: values.ownerType,
        documents: documentUrls,
      };

      await onSubmit(patrimoineData);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur!",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Désignation</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'actif" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'actif</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handleAssetTypeChange(value);
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ASSET_TYPES.map((assetType) => (
                    <SelectItem key={assetType.value} value={assetType.value}>
                      {assetType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOtherType && (
          <FormField
            control={form.control}
            name="otherType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autre type d'actif</FormLabel>
                <FormControl>
                  <Input placeholder="Spécifiez le type d'actif" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="valeur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valeur (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateAcquisitionField control={form.control} />

        <FormField
          control={form.control}
          name="etat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>État</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'état" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="bon">Bon</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="mauvais">Mauvais</SelectItem>
                  <SelectItem value="hors-service">Hors service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propriétaire</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le propriétaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="paroisse">Paroisse</SelectItem>
                  <SelectItem value="communaute">Communauté</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de l'actif"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Documents</FormLabel>
          <DocumentUpload 
            initialUrls={documentUrls}
            onFilesChange={handleDocumentsChange}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};