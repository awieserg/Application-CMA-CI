
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersDirectory } from "@/components/annuaire/MembersDirectory";
import { ServantDirectory } from "@/components/annuaire/ServantDirectory";
import { Users, UserCog } from "lucide-react";

export function DirectoryTab() {
  const [activeTab, setActiveTab] = useState("membres");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Annuaire centralisé</CardTitle>
          <CardDescription>
            Consultez et gérez l'annuaire de tous les membres et serviteurs de l'église
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="membres" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Membres
              </TabsTrigger>
              <TabsTrigger value="serviteurs" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" /> Serviteurs de Dieu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="membres" className="mt-4">
              <MembersDirectory />
            </TabsContent>

            <TabsContent value="serviteurs" className="mt-4">
              <ServantDirectory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
