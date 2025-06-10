
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicesRapport } from "./ServicesRapport";
import { useParoisseServices } from "@/hooks/useParoisseServices";

interface ParoisseRapportProps {
  paroisseId: string;
}

export function ParoisseRapport({ paroisseId }: ParoisseRapportProps) {
  const { services, isLoading } = useParoisseServices(paroisseId);
  
  const generatePDF = () => {
    // Cette fonction sera implémentée plus tard pour générer un PDF
    console.log("Génération du PDF...");
  };

  // Mock data - in a real app, this would come from your database
  const paroisseData = {
    informationsGenerales: {
      nom: "CMA Abobo Centre",
      district: "Abobo",
      region: "Abidjan Nord",
      pasteur: "Pasteur Touré Ismaël",
      dateCreation: "1995",
      adresse: "Quartier Abobo Centre, près du marché principal",
      telephone: "+225 07 12 34 56 78",
      email: "cma.abobocentre@gmail.com"
    },
    statistiques: {
      nombreTotal: 180,
      communautes: [
        { nom: "Communauté Centrale", membres: 85 },
        { nom: "Communauté Est", membres: 45 },
        { nom: "Communauté Ouest", membres: 50 }
      ],
      services: [
        { nom: "Culte du dimanche", participants: 150 },
        { nom: "Étude biblique", participants: 45 },
        { nom: "Prière d'intercession", participants: 30 }
      ]
    },
    finances: {
      revenus: {
        dimes: "2,500,000 FCFA",
        offrandes: "1,200,000 FCFA",
        autres: "300,000 FCFA"
      },
      depenses: {
        fonctionnement: "800,000 FCFA",
        projets: "1,500,000 FCFA",
        autres: "200,000 FCFA"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rapport de la Paroisse</h2>
        <Button onClick={generatePDF} className="bg-green-700 hover:bg-green-800">
          <FileText className="w-4 h-4 mr-2" />
          Générer PDF
        </Button>
      </div>

      {/* Services Religieux Report */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Chargement des services religieux...</p>
          </CardContent>
        </Card>
      ) : (
        <ServicesRapport services={services || []} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(paroisseData.informationsGenerales).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="font-bold text-xl mb-4">
              Nombre total de membres: {paroisseData.statistiques.nombreTotal}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Répartition par communauté</h4>
                {paroisseData.statistiques.communautes.map((comm, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span>{comm.nom}:</span>
                    <span>{comm.membres} membres</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Participation aux services</h4>
                {paroisseData.statistiques.services.map((service, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span>{service.nom}:</span>
                    <span>{service.participants} participants</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapport Financier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Revenus</h4>
              {Object.entries(paroisseData.finances.revenus).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="capitalize">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dépenses</h4>
              {Object.entries(paroisseData.finances.depenses).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="capitalize">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
