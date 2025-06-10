
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ParoisseMembresTable } from "@/components/paroisses/ParoisseMembresTable";
import { AddMembreForm } from "@/components/membres/AddMembreForm";
import { Membre } from "@/hooks/useParoisseMembres";
import { ViewMembreDialog } from "@/components/membres/ViewMembreDialog";
import { toast } from "sonner";

interface MembresSectionContentProps {
  paroisseId: string;
  membres: Membre[];
  addMembre: any;
  deleteMembre: any;
}

export const MembresSectionContent: React.FC<MembresSectionContentProps> = ({
  paroisseId,
  membres,
  addMembre,
  deleteMembre,
}) => {
  const [isAddMembreOpen, setIsAddMembreOpen] = useState(false);
  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleVoir = (membre: Membre) => {
    setSelectedMembre(membre);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (membre: Membre) => {
    setSelectedMembre(membre);
    setIsAddMembreOpen(true);
  };

  const handleDelete = async (membre: Membre) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${membre.nom} ${membre.prenoms} ?`)) {
      return;
    }

    try {
      await deleteMembre.mutateAsync(membre.id);
      toast.success("Membre supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du membre");
    }
  };

  const handleAddMembreSubmit = async (data: any) => {
    if (!paroisseId) {
      toast.error("Veuillez sélectionner une paroisse");
      return;
    }

    try {
      await addMembre.mutateAsync({
        ...data,
        paroisse_id: paroisseId,
      });
      setIsAddMembreOpen(false);
      toast.success("Membre ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre:", error);
      toast.error("Erreur lors de l'ajout du membre");
    }
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-end gap-2 mb-4">
        <Button
          onClick={() => {
            setSelectedMembre(null);
            setIsAddMembreOpen(true);
          }}
          className="bg-cma-blue hover:bg-blue-800 rounded-lg whitespace-nowrap shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      </div>

      <AddMembreForm
        open={isAddMembreOpen}
        onOpenChange={setIsAddMembreOpen}
        onSubmit={handleAddMembreSubmit}
        isLoading={addMembre.isPending}
        paroisseId={paroisseId}
        editData={selectedMembre}
      />

      <ViewMembreDialog 
        membre={selectedMembre}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <ParoisseMembresTable
        membres={membres || []}
        onView={handleVoir}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
