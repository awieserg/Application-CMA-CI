
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

const budgetCategories = [
  "Dîme",
  "Offrande",
  "Don",
  "Contribution spéciale",
  "Autres"
];

export const RevenueForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer un Revenu</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de Revenu</Label>
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
              <Label htmlFor="communaute">Communauté</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la communauté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paroisse">Paroisse</SelectItem>
                  <SelectItem value="centrale">Communauté Centrale</SelectItem>
                  <SelectItem value="est">Communauté Est</SelectItem>
                  <SelectItem value="ouest">Communauté Ouest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Description du revenu" />
          </div>

          <Button type="submit" className="w-full">Enregistrer le Revenu</Button>
        </form>
      </CardContent>
    </Card>
  );
};
