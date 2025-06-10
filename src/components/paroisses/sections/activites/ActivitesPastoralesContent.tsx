
import React, { useState } from "react";
import { PastoralActivityForm } from "@/components/paroisses/PastoralActivityForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileEdit, Plus } from "lucide-react";
import { ParoisseActivitesTable } from "@/components/paroisses/ParoisseActivitesTable";
import { ActivitePastorale } from "@/hooks/useParoisseActivites";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ActivitesPastoralesContentProps {
  paroisseId: string;
  activites: ActivitePastorale[];
  addActivite: any;
  updateActivite: any;
  deleteActivite: any;
}

export const ActivitesPastoralesContent: React.FC<ActivitesPastoralesContentProps> = ({
  paroisseId,
  activites,
  addActivite,
  updateActivite,
  deleteActivite,
}) => {
  const [selectedActivite, setSelectedActivite] = useState<ActivitePastorale | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const handleVoir = (activite: ActivitePastorale) => {
    toast.info("Fonctionnalité en cours de développement");
  };

  const handleEdit = (activite: ActivitePastorale) => {
    setSelectedActivite(activite);
    setIsFormDialogOpen(true);
  };

  const handleDelete = async (activite: ActivitePastorale) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cette activité ?`)) {
      return;
    }

    try {
      await deleteActivite.mutateAsync(activite.id);
      toast.success("Activité supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'activité");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsFormDialogOpen(open);
    if (!open) setSelectedActivite(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Activités Pastorales</h2>
        <Button 
          className="bg-cma-blue"
          onClick={() => setIsFormDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Activité
        </Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedActivite ? "Modifier l'activité pastorale" : "Nouvelle Activité Pastorale"}
            </DialogTitle>
          </DialogHeader>
          <PastoralActivityForm
            paroisseId={paroisseId}
            onSubmit={selectedActivite ? updateActivite.mutateAsync : addActivite.mutateAsync}
            initialData={selectedActivite}
            onOpenChange={handleOpenChange}
          />
        </DialogContent>
      </Dialog>

      {activites && activites.length > 0 ? (
        <ParoisseActivitesTable
          activites={activites}
          onView={handleVoir}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-gray-500 text-center py-8">
          Aucune activité pastorale enregistrée
        </div>
      )}
    </div>
  );
};
