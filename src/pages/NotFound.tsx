
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-6xl font-bold text-cma-blue mb-4">404</h1>
        <p className="text-2xl font-semibold mb-6">Page non trouvée</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="bg-cma-blue hover:bg-blue-800">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
