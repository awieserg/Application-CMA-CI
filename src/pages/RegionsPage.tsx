import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RegionSelector } from "@/components/selectors/RegionSelector";
import { RegionSectionDropdown } from "@/components/RegionSectionDropdown";
import { sectionDefinitions } from "@/components/regions/sections/sectionDefinitions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionOverview } from "@/components/regions/sections/RegionOverview";

const RegionsPage = () => {
  const [regionId, setRegionId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("vue-densemble");

  const { data: region, isLoading: isRegionLoading } = useQuery({
    queryKey: ['region', regionId],
    queryFn: async () => {
      if (!regionId) return null;
      
      const { data, error } = await supabase
        .from('regions')
        .select(`
          *,
          districts (
            id,
            nom,
            code,
            surintendant,
            paroisses (
              id,
              nom,
              membres (count)
            )
          )
        `)
        .eq('id', regionId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!regionId
  });

  const renderContent = () => {
    if (!regionId) {
      return (
        <div className="text-center py-8 text-gray-500">
          Veuillez sélectionner une région pour voir ses détails
        </div>
      );
    }

    if (isRegionLoading) {
      return (
        <div className="text-center py-8">
          Chargement des données...
        </div>
      );
    }

    switch (activeSection) {
      case "vue-densemble":
        return <RegionOverview region={region} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Section {activeSection} à venir
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cma-dark font-[Playfair Display]">
            Administrer les Régions
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full space-y-4">
                <RegionSelector 
                  onRegionSelect={setRegionId}
                  currentRegionId={regionId || undefined}
                />
                {region && (
                  <div>
                    <span className="text-cma-blue font-bold text-2xl">{region.nom}</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Surintendant: {region.surintendant || 'Non assigné'}
                    </p>
                  </div>
                )}
              </div>
              <RegionSectionDropdown
                sections={sectionDefinitions}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegionsPage;