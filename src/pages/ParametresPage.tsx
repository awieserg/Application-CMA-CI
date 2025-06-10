
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Lock, FileText, UserCog, Building } from "lucide-react";
import { AccountTab } from "@/components/settings/tabs/AccountTab";
import { OrganizationTab } from "@/components/settings/tabs/OrganizationTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { DirectoryTab } from "@/components/settings/tabs/DirectoryTab";
import { ReportsTab } from "@/components/settings/tabs/ReportsTab";

const ParametresPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-game-primary font-[Righteous]">
          Paramètres
        </h1>

        <Tabs defaultValue="compte">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 bg-game-light">
            <TabsTrigger value="compte" className="flex items-center gap-2 data-[state=active]:bg-game-primary data-[state=active]:text-white">
              <UserCog className="h-4 w-4" /> Compte
            </TabsTrigger>
            <TabsTrigger value="organisation" className="flex items-center gap-2 data-[state=active]:bg-game-primary data-[state=active]:text-white">
              <Building className="h-4 w-4" /> Organisation
            </TabsTrigger>
            <TabsTrigger value="securite" className="flex items-center gap-2 data-[state=active]:bg-game-primary data-[state=active]:text-white">
              <Lock className="h-4 w-4" /> Sécurité
            </TabsTrigger>
            <TabsTrigger value="annuaire" className="flex items-center gap-2 data-[state=active]:bg-game-primary data-[state=active]:text-white">
              <Users className="h-4 w-4" /> Annuaire
            </TabsTrigger>
            <TabsTrigger value="rapports" className="flex items-center gap-2 data-[state=active]:bg-game-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4" /> Rapports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compte" className="mt-6">
            <AccountTab />
          </TabsContent>

          <TabsContent value="organisation" className="mt-6">
            <OrganizationTab />
          </TabsContent>

          <TabsContent value="securite" className="mt-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="annuaire" className="mt-6">
            <DirectoryTab />
          </TabsContent>

          <TabsContent value="rapports" className="mt-6">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ParametresPage;
