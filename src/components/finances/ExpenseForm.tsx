import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

const budgetCategories = [
  "Salaires",
  "Maintenance",
  "Utilités",
  "Fournitures",
  "Évangélisation",
  "Autres"
];

export const ExpenseForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une Dépense</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de Dépense</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input id="amount" type="number" placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beneficiaire">Bénéficiaire</Label>
              <Input id="beneficiaire" placeholder="Nom du bénéficiaire" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Description détaillée de la dépense" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justificatif">Justificatif</Label>
            <Input id="justificatif" type="file" />
          </div>

          <Button type="submit" className="w-full">Enregistrer la Dépense</Button>
        </form>
      </CardContent>
    </Card>
  );
};
