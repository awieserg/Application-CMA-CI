
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ParoisseHeader } from "@/components/paroisses/ParoisseHeader";
import { ParoisseSectionDropdown } from "@/components/ParoisseSectionDropdown";
import { ParoisseSelector } from "@/components/selectors/ParoisseSelector";
import { toast } from "sonner";
import { useParoisseMembres } from "@/hooks/useParoisseMembres";
import { useParoisseServices } from "@/hooks/useParoisseServices";
import { useParoissePatrimoine } from "@/hooks/useParoissePatrimoine";
import { useParoisseFideles } from "@/hooks/useParoisseFideles";
import { useParoisseActivites } from "@/hooks/useParoisseActivites";
import { ParoisseSectionContent } from "@/components/paroisses/sections/ParoisseSectionContent";
import { sectionDefinitions, Section } from "@/components/paroisses/sections/sectionDefinitions";

const ParoissesPage = () => {
  const [activeSection, setActiveSection] = useState("vue-densemble");
  const [paroisseId, setParoisseId] = useState<string | null>(null);

  const { 
    membres, 
    isLoading: membresLoading,
    addMembre,
    updateMembre,
    deleteMembre
  } = useParoisseMembres(paroisseId || '');

  const {
    services,
    isLoading: servicesLoading,
    addService,
    updateService,
    deleteService
  } = useParoisseServices(paroisseId || '');

  const {
    patrimoines,
    isLoading: patrimoinesLoading,
    addPatrimoine,
    updatePatrimoine,
    deletePatrimoine
  } = useParoissePatrimoine(paroisseId || '');

  const {
    recensements,
    isLoading: recensementsLoading,
    addRecensement,
    updateRecensement
  } = useParoisseFideles(paroisseId || '');

  const {
    activites,
    isLoading: activitesLoading,
    addActivite,
    updateActivite,
    deleteActivite
  } = useParoisseActivites(paroisseId || '');

  const handleParoisseSelect = (id: string) => {
    setParoisseId(id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-900 font-[Playfair Display]">
            Gestion Administrative de la CMA-CI
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full space-y-4">
                <ParoisseSelector 
                  onParoisseSelect={handleParoisseSelect}
                  currentParoisseId={paroisseId || undefined}
                />
                <ParoisseHeader paroisseId={paroisseId || undefined} />
              </div>
              <ParoisseSectionDropdown
                sections={sectionDefinitions}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          </CardHeader>
          <CardContent>
            {!paroisseId ? (
              <div className="text-center py-8 text-gray-500">
                Veuillez sélectionner une paroisse pour voir ses détails
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <ParoisseSectionContent 
                  activeSection={activeSection}
                  paroisseId={paroisseId}
                  membres={membres || []}
                  addMembre={addMembre}
                  updateMembre={updateMembre}
                  deleteMembre={deleteMembre}
                  services={services || []}
                  addService={addService}
                  updateService={updateService}
                  deleteService={deleteService}
                  patrimoines={patrimoines || []}
                  addPatrimoine={addPatrimoine}
                  updatePatrimoine={updatePatrimoine}
                  deletePatrimoine={deletePatrimoine}
                  recensements={recensements || []}
                  addRecensement={addRecensement}
                  updateRecensement={updateRecensement}
                  activites={activites || []}
                  addActivite={addActivite}
                  updateActivite={updateActivite}
                  deleteActivite={deleteActivite}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ParoissesPage;
