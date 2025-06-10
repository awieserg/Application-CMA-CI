
import React from "react";
import { ServiceReligieux } from "@/hooks/useParoisseServices";
import { ServiceReligieuxForm } from "@/components/services/ServiceReligieuxForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useParoisseServices } from "@/hooks/useParoisseServices";

interface ReligiousServiceFormProps {
  paroisseId: string;
  initialData?: ServiceReligieux | null;
  onSubmitSuccess?: () => void;
}

export const ReligiousServiceForm: React.FC<ReligiousServiceFormProps> = ({
  paroisseId,
  initialData,
  onSubmitSuccess
}) => {
  const { addService, updateService } = useParoisseServices(paroisseId);
  const isEditMode = !!initialData;

  const handleFormSubmit = async (data) => {
    try {
      const serviceData = {
        ...data,
        paroisse_id: paroisseId
      };
      
      console.log("Service data to submit:", serviceData);
      
      if (isEditMode && initialData?.id) {
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
        toast.success("Service mis à jour avec succès");
      } else {
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
        toast.success("Service ajouté avec succès");
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting service data:", error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isEditMode ? "Modifier le service religieux" : "Ajouter un service religieux"}
        </h3>
        {onSubmitSuccess && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onSubmitSuccess}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ServiceReligieuxForm
        paroisseId={paroisseId}
        initialData={initialData}
        onOpenChange={() => {}}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
