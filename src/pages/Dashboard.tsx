import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, MapPin, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  // Récupérer les statistiques globales
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        { count: regionsCount },
        { count: districtsCount },
        { count: paroissesCount },
        { count: membresCount }
      ] = await Promise.all([
        supabase.from('regions').select('*', { count: 'exact', head: true }),
        supabase.from('districts').select('*', { count: 'exact', head: true }),
        supabase.from('paroisses').select('*', { count: 'exact', head: true }),
        supabase.from('membres').select('*', { count: 'exact', head: true })
      ]);

      return {
        regions: regionsCount || 0,
        districts: districtsCount || 0,
        paroisses: paroissesCount || 0,
        membres: membresCount || 0
      };
    }
  });

  // Récupérer les données pour le graphique de répartition des membres
  const { data: membresParRegion, isLoading: membresLoading } = useQuery({
    queryKey: ['membres-par-region'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select(`
          nom,
          districts (
            paroisses (
              membres (count)
            )
          )
        `);

      if (error) throw error;

      return data?.map(region => ({
        nom: region.nom,
        membres: region.districts?.reduce((total: number, district: any) => {
          return total + district.paroisses?.reduce((sum: number, paroisse: any) => {
            return sum + (paroisse.membres?.[0]?.count || 0);
          }, 0) || 0;
        }, 0) || 0
      })) || [];
    }
  });

  // Récupérer les événements à venir
  const { data: evenements, isLoading: evenementsLoading } = useQuery({
    queryKey: ['evenements-a-venir'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activites_pastorales')
        .select('*')
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  const statCards = [
    { 
      title: "Régions", 
      value: stats?.regions || 0, 
      icon: MapPin, 
      color: "bg-blue-100 text-cma-blue" 
    },
    { 
      title: "Districts", 
      value: stats?.districts || 0, 
      icon: Building, 
      color: "bg-amber-100 text-amber-700" 
    },
    { 
      title: "Paroisses", 
      value: stats?.paroisses || 0, 
      icon: BookOpen, 
      color: "bg-green-100 text-green-700" 
    },
    { 
      title: "Membres", 
      value: stats?.membres || 0, 
      icon: Users, 
      color: "bg-purple-100 text-purple-700" 
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-cma-dark font-[Playfair Display]">
          Tableau de bord
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {stat.title}
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {statsLoading ? "..." : stat.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des membres par région</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {membresLoading ? (
                <div className="h-full flex items-center justify-center">
                  Chargement des données...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={membresParRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="membres" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              {evenementsLoading ? (
                <div className="py-8 text-center">Chargement des événements...</div>
              ) : evenements && evenements.length > 0 ? (
                <div className="space-y-4">
                  {evenements.map((event) => (
                    <div key={event.id} className="border-l-4 border-cma-blue pl-4 py-2">
                      <p className="font-medium">{event.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("fr-FR")} - {event.lieu}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Aucun événement à venir
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;