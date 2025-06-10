import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Calendar, FileText } from "lucide-react";

interface DistrictOverviewProps {
  district: any;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({ district }) => {
  // Calculer le nombre total de membres
  const totalMembres = district.paroisses?.reduce((total: number, paroisse: any) => {
    return total + (paroisse.membres?.[0]?.count || 0);
  }, 0);

  const stats = [
    {
      title: "Paroisses",
      value: district.paroisses?.length || 0,
      icon: Building,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Membres",
      value: totalMembres,
      icon: Users,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Activités",
      value: "12", // À remplacer par les vraies données
      icon: Calendar,
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "Rapports",
      value: "8", // À remplacer par les vraies données
      icon: FileText,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {stat.title}
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Liste des paroisses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {district.paroisses?.map((paroisse: any) => (
                <div key={paroisse.id} className="border-l-4 border-cma-blue pl-4 py-2">
                  <p className="font-medium">{paroisse.nom}</p>
                  <p className="text-sm text-muted-foreground">
                    {paroisse.pasteur || "Pas de pasteur assigné"} • {paroisse.membres?.[0]?.count || 0} membres
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">Réunion des pasteurs</p>
                <p className="text-sm text-muted-foreground">15 Mai 2025</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <p className="font-medium">Formation des leaders</p>
                <p className="text-sm text-muted-foreground">23 Mai 2025</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="font-medium">Culte d'actions de grâce</p>
                <p className="text-sm text-muted-foreground">2 Juin 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};