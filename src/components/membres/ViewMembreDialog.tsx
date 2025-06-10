
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Membre } from "@/hooks/useParoisseMembres";

interface ViewMembreDialogProps {
  membre: Membre | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMembreDialog({ membre, open, onOpenChange }: ViewMembreDialogProps) {
  if (!membre) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du membre</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Informations personnelles</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {membre.nom}</p>
              <p><span className="font-medium">Prénoms:</span> {membre.prenoms}</p>
              <p><span className="font-medium">Date de naissance:</span> {membre.date_naissance ? new Date(membre.date_naissance).toLocaleDateString("fr-FR") : "Non spécifiée"}</p>
              <p><span className="font-medium">Lieu de naissance:</span> {membre.lieu_naissance || "Non spécifié"}</p>
              <p><span className="font-medium">Profession:</span> {membre.profession || "Non spécifiée"}</p>
              <p><span className="font-medium">Situation matrimoniale:</span> {membre.situation_matrimoniale || "Non spécifiée"}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Téléphone:</span> {membre.telephone || "Non spécifié"}</p>
              <p><span className="font-medium">Email:</span> {membre.email || "Non spécifié"}</p>
              <p><span className="font-medium">Adresse:</span> {membre.adresse || "Non spécifiée"}</p>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Informations d'église</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Rôle:</span> {membre.role}</p>
              <p><span className="font-medium">Communauté:</span> {membre.communaute || "Non spécifiée"}</p>
              <p><span className="font-medium">Date d'adhésion:</span> {membre.date_adhesion ? new Date(membre.date_adhesion).toLocaleDateString("fr-FR") : "Non spécifiée"}</p>
              <p><span className="font-medium">Date de baptême:</span> {membre.date_bapteme ? new Date(membre.date_bapteme).toLocaleDateString("fr-FR") : "Non spécifiée"}</p>
              <p><span className="font-medium">Lieu de baptême:</span> {membre.lieu_bapteme || "Non spécifié"}</p>
              <p><span className="font-medium">Ministères:</span> {membre.ministeres?.length ? membre.ministeres.join(", ") : "Aucun"}</p>
              {membre.observations && (
                <p><span className="font-medium">Observations:</span> {membre.observations}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
