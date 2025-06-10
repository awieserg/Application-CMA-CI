
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueForm } from "./RevenueForm";
import { ExpenseForm } from "./ExpenseForm";
import { BudgetOverview } from "./BudgetOverview";
import { Receipt, Calculator, Wallet } from "lucide-react";

export const FinanceSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenus</CardTitle>
            <Receipt className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15,750,000 FCFA</div>
            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
            <Calculator className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12,234,000 FCFA</div>
            <p className="text-xs text-muted-foreground">+4.25% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3,516,000 FCFA</div>
            <p className="text-xs text-muted-foreground">Balance courante</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenus" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="revenus">
          <RevenueForm />
        </TabsContent>
        <TabsContent value="depenses">
          <ExpenseForm />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};
