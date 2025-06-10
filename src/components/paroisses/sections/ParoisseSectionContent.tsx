
import React, { useState } from "react";
import { ParoisseOverview } from "@/components/paroisses/ParoisseOverview";
import { ReligiousServiceForm } from "@/components/paroisses/ReligiousServiceForm";
import { FinanceSection } from "@/components/finances/FinanceSection";
import { ServiteursAnnuaire } from "@/components/annuaire/ServiteursAnnuaire";
import { ParoisseAnnuaire } from "@/components/annuaire/ParoisseAnnuaire";
import { ParoisseRapport } from "@/components/rapports/ParoisseRapport";
import { ParoisseSettingsForm } from "@/components/paroisses/ParoisseSettingsForm";
import { MembresSectionContent } from "./membres/MembresSectionContent";
import { FidelesSectionContent } from "./fideles/FidelesSectionContent";
import { ActivitesPastoralesContent } from "./activites/ActivitesPastoralesContent";
import { ServicesReligieuxTable } from "@/components/services/ServicesReligieuxTable";
import { PatrimoineSection } from "../patrimoine/PatrimoineSection";
import { Button } from "@/components/ui/button";
import { ServiceReligieux } from "@/hooks/useParoisseServices";
import { toast } from "sonner";

interface ParoisseSectionContentProps {
  activeSection: string;
  paroisseId: string;
  membres: any[];
  addMembre: any;
  updateMembre: any;
  deleteMembre: any;
  services: any[];
  addService: any;
  updateService: any;
  deleteService: any;
  patrimoines: any[];
  addPatrimoine: any;
  updatePatrimoine: any;
  deletePatrimoine: any;
  recensements: any[];
  addRecensement: any;
  updateRecensement: any;
  activites: any[];
  addActivite: any;
  updateActivite: any;
  deleteActivite: any;
}

export const ParoisseSectionContent: React.FC<ParoisseSectionContentProps> = ({
  activeSection,
  paroisseId,
  membres,
  addMembre,
  updateMembre,
  deleteMembre,
  services,
  addService,
  updateService,
  deleteService,
  patrimoines,
  addPatrimoine,
  updatePatrimoine,
  deletePatrimoine,
  recensements,
  addRecensement,
  updateRecensement,
  activites,
  addActivite,
  updateActivite,
  deleteActivite,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceReligieux | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleServiceEdit = (service: ServiceReligieux) => {
    setSelectedService(service);
    setShowServiceForm(true);
  };

  const handleServiceDelete = (service: ServiceReligieux) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.nom}"?`)) {
      deleteService.mutate(service.id, {
        onSuccess: () => {
          toast.success("Service supprimé avec succès");
        },
        onError: (error) => {
          toast.error(`Erreur lors de la suppression: ${error.message}`);
        }
      });
    }
  };

  if (activeSection === "vue-densemble") {
    return <ParoisseOverview id={paroisseId} />;
  }

  if (activeSection === "membres") {
    return (
      <MembresSectionContent
        paroisseId={paroisseId}
        membres={membres}
        addMembre={addMembre}
        deleteMembre={deleteMembre}
      />
    );
  }

  if (activeSection === "nb-fideles") {
    return (
      <FidelesSectionContent
        paroisseId={paroisseId}
        recensements={recensements}
        addRecensement={addRecensement}
        updateRecensement={updateRecensement}
      />
    );
  }

  if (activeSection === "activite-pastorale") {
    return (
      <ActivitesPastoralesContent
        paroisseId={paroisseId}
        activites={activites}
        addActivite={addActivite}
        updateActivite={updateActivite}
        deleteActivite={deleteActivite}
      />
    );
  }

  if (activeSection === "services") {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">Services Religieux</h2>
          <Button 
            onClick={() => {
              setSelectedService(null);
              setShowServiceForm(true);
            }}
            className="bg-green-700 hover:bg-green-800"
          >
            Ajouter un service religieux
          </Button>
        </div>
        
        {showServiceForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <ReligiousServiceForm 
              paroisseId={paroisseId}
              initialData={selectedService}
              onSubmitSuccess={() => {
                setShowServiceForm(false);
                setSelectedService(null);
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {services && services.length > 0 ? (
            <ServicesReligieuxTable 
              services={services} 
              onEdit={handleServiceEdit}
              onDelete={handleServiceDelete}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              {addService.isLoading ? (
                <p>Chargement des services religieux...</p>
              ) : (
                <p>Aucun service religieux n'a été enregistré pour cette paroisse.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSection === "patrimoine") {
    return (
      <PatrimoineSection 
        paroisseId={paroisseId} 
        patrimoines={patrimoines}
        addPatrimoine={addPatrimoine}
        updatePatrimoine={updatePatrimoine}
        deletePatrimoine={deletePatrimoine}
      />
    );
  }

  if (activeSection === "finance") {
    return <FinanceSection />;
  }

  if (activeSection === "rapport") {
    return <ParoisseRapport paroisseId={paroisseId} />;
  }

  if (activeSection === "annuaire") {
    return (
      <div className="space-y-6">
        <ServiteursAnnuaire />
        <ParoisseAnnuaire />
      </div>
    );
  }

  if (activeSection === "parametres") {
    return <ParoisseSettingsForm paroisseId={paroisseId} />;
  }

  return null;
};
