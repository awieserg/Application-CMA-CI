
import React, { useState } from "react";
import { ParoisseFidelesCount } from "@/components/paroisses/ParoisseFidelesCount";
import { CommunauteMembresForm } from "@/components/membres/CommunauteMembresForm";
import { toast } from "sonner";
import { RecensementFideles } from "@/hooks/useParoisseFideles";

interface FidelesSectionContentProps {
  paroisseId: string;
  recensements: RecensementFideles[];
  addRecensement: any;
  updateRecensement: any;
}

export const FidelesSectionContent: React.FC<FidelesSectionContentProps> = ({
  paroisseId,
  recensements,
  addRecensement,
  updateRecensement,
}) => {
  const [isAddMembresCommunauteOpen, setIsAddMembresCommunauteOpen] = useState(false);

  const handleAddMembresCommunaute = async (data: any) => {
    try {
      console.log("Nouvelle mise à jour:", data);

      // Transformer les données pour correspondre au format de la table recensement_fideles
      const recensementData = {
        paroisse_id: paroisseId,
        communaute: data.communaute,
        nombre_membres: data.hommes + data.femmes + data.garcons + data.filles,
        date_recensement: data.dateRecensement
      };

      await addRecensement.mutateAsync(recensementData);
      toast.success("Nombre de membres mis à jour avec succès");
      setIsAddMembresCommunauteOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du recensement:", error);
      toast.error("Erreur lors de la mise à jour du nombre de membres");
    }
  };

  return (
    <>
      <ParoisseFidelesCount
        membresCommunaute={recensements?.map(rec => ({
          communaute: rec.communaute,
          nombreMembres: rec.nombre_membres,
          dateRecensement: rec.date_recensement
        })) || []}
        totalMembres={(recensements || []).reduce((acc, curr) => acc + curr.nombre_membres, 0)}
        onUpdate={() => setIsAddMembresCommunauteOpen(true)}
      />
      <CommunauteMembresForm
        open={isAddMembresCommunauteOpen}
        onOpenChange={setIsAddMembresCommunauteOpen}
        onSubmit={handleAddMembresCommunaute}
        paroisseId={paroisseId}
      />
    </>
  );
};
