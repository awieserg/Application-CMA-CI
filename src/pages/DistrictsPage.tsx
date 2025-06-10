import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DistrictSelector } from "@/components/selectors/DistrictSelector";
import { DistrictSectionDropdown } from "@/components/DistrictSectionDropdown";
import { sectionDefinitions } from "@/components/districts/sections/sectionDefinitions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DistrictOverview } from "@/components/districts/sections/DistrictOverview";

const DistrictsPage = () => {
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("vue-densemble");

  const { data: district, isLoading: isDistrictLoading } = useQuery({
    queryKey: ['district', districtId],
    queryFn: async () => {
      if (!districtId) return null;
      
      const { data, error } = await supabase
        .from('districts')
        .select(`
          *,
          regions (nom),
          paroisses (
            id,
            nom,
            code,
            pasteur,
            membres (count)
          )
        `)
        .eq('id', districtId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!districtId
  });

  const renderContent = () => {
    if (!districtId) {
      return (
        <div className="text-center py-8 text-gray-500">
          Veuillez sélectionner un district pour voir ses détails
        </div>
      );
    }

    if (isDistrictLoading) {
      return (
        <div className="text-center py-8">
          Chargement des données...
        </div>
      );
    }

    switch (activeSection) {
      case "vue-densemble":
        return <DistrictOverview district={district} />;
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
            Administrer les Districts
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full space-y-4">
                <DistrictSelector 
                  onDistrictSelect={setDistrictId}
                  currentDistrictId={districtId || undefined}
                />
                {district && (
                  <div>
                    <span className="text-cma-blue font-bold text-2xl">{district.nom}</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {district.regions?.nom} | 
                      Surintendant: {district.surintendant || 'Non assigné'}
                    </p>
                  </div>
                )}
              </div>
              <DistrictSectionDropdown
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

export default DistrictsPage;