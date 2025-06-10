
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function ReportsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports et données analytiques</CardTitle>
        <CardDescription>
          Générez des rapports et visualisez les données de l'église.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover-card group">
            <FileText className="h-8 w-8 mb-2 text-game-primary group-hover:animate-float" />
            Rapport des membres par région
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover-card group">
            <FileText className="h-8 w-8 mb-2 text-game-secondary group-hover:animate-float" />
            Rapport des activités pastorales
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover-card group">
            <FileText className="h-8 w-8 mb-2 text-game-tertiary group-hover:animate-float" />
            Rapport financier
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover-card group">
            <FileText className="h-8 w-8 mb-2 text-game-accent group-hover:animate-float" />
            Statistiques de croissance
          </Button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Rapports récents</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du rapport</TableHead>
                  <TableHead>Date de génération</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Rapport trimestriel Q1 2025</TableCell>
                  <TableCell>12 avril 2025</TableCell>
                  <TableCell>Konan Michel</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Statistiques baptêmes 2024</TableCell>
                  <TableCell>28 mars 2025</TableCell>
                  <TableCell>Aka Jean</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bilan financier 2024</TableCell>
                  <TableCell>15 février 2025</TableCell>
                  <TableCell>Kouassi Marthe</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
