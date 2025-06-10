
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccountTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion du compte</CardTitle>
        <CardDescription>
          Modifiez vos informations personnelles et vos préférences d'utilisateur.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                <p className="font-medium">Pasteur Koffi Emmanuel</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">koffi.emmanuel@cma-ci.org</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p className="font-medium">+225 07 07 07 07 07</p>
              </div>
            </div>
            <Button variant="fun" className="mt-3">
              Modifier mon profil
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Préférences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Notifications par email</span>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Langue de l'application</span>
                <Button variant="outline" size="sm">
                  Français
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
