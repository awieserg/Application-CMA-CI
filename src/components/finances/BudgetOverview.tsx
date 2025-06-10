import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const budgetCategories = [
  "Salaires",
  "Maintenance",
  "Utilités",
  "Fournitures",
  "Évangélisation",
  "Autres"
];

export const BudgetOverview = () => {
  const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false);
  const [budgetType, setBudgetType] = useState<'revenus' | 'depenses'>('revenus');
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'ajout de ligne budgétaire
    toast.success("Ligne budgétaire ajoutée avec succès");
    setShowAddBudgetDialog(false);
    setShowCustomCategory(false);
    setCustomCategory("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Aperçu du Budget</CardTitle>
        <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter au Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une Prévision Budgétaire</DialogTitle>
              <DialogDescription>
                Créez une nouvelle ligne budgétaire pour les revenus ou dépenses.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBudget} className="space-y-4 py-4">
              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant={budgetType === 'revenus' ? 'default' : 'outline'}
                  onClick={() => setBudgetType('revenus')}
                  className="flex-1"
                >
                  Revenus
                </Button>
                <Button 
                  type="button"
                  variant={budgetType === 'depenses' ? 'default' : 'outline'}
                  onClick={() => setBudgetType('depenses')}
                  className="flex-1"
                >
                  Dépenses
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Catégorie</Label>
                {!showCustomCategory ? (
                  <>
                    <Select onValueChange={(value) => {
                      if (value === "autre") {
                        setShowCustomCategory(true);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetType === 'revenus' ? (
                          <>
                            <SelectItem value="dime">Dîme</SelectItem>
                            <SelectItem value="offrande">Offrande</SelectItem>
                            <SelectItem value="don">Don</SelectItem>
                            <SelectItem value="contribution">Contribution spéciale</SelectItem>
                            <SelectItem value="autre">Autre catégorie...</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="salaires">Salaires</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="utilites">Utilités</SelectItem>
                            <SelectItem value="fournitures">Fournitures</SelectItem>
                            <SelectItem value="evangelisation">Évangélisation</SelectItem>
                            <SelectItem value="autre">Autre catégorie...</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Nom de la nouvelle catégorie"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCustomCategory("");
                      }}
                    >
                      Retour aux catégories standards
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Montant Prévisionnel (FCFA)</Label>
                <Input type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Description de la prévision budgétaire" />
              </div>

              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Catégorie</TableHead>
              <TableHead>Budget Alloué</TableHead>
              <TableHead>Dépenses Réelles</TableHead>
              <TableHead>Reste</TableHead>
              <TableHead>% Utilisé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Salaires</TableCell>
              <TableCell>5,000,000 FCFA</TableCell>
              <TableCell>4,200,000 FCFA</TableCell>
              <TableCell>800,000 FCFA</TableCell>
              <TableCell>84%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maintenance</TableCell>
              <TableCell>3,000,000 FCFA</TableCell>
              <TableCell>2,100,000 FCFA</TableCell>
              <TableCell>900,000 FCFA</TableCell>
              <TableCell>70%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Évangélisation</TableCell>
              <TableCell>2,500,000 FCFA</TableCell>
              <TableCell>1,800,000 FCFA</TableCell>
              <TableCell>700,000 FCFA</TableCell>
              <TableCell>72%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
