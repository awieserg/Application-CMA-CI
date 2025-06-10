
import { useState } from "react";
import { GenericFormDialog } from "@/components/common/GenericFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateInstitutionDialog() {
  const [nom, setNom] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Générer un code basé sur le nom (3 premières lettres en majuscules + timestamp)
      const code = `${nom.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`;
      
      const { error } = await supabase
        .from('institutions')
        .insert({ nom, code });

      if (error) throw error;

      toast({
        title: "Institution créée",
        description: "L'institution a été ajoutée avec succès"
      });
      
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      setNom("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  return (
    <GenericFormDialog
      title="Nouvelle Institution"
      description="Créer une nouvelle institution ou organisation de l'église"
      buttonLabel="Institution"
      buttonIcon={<Building className="h-4 w-4" />}
      onSubmit={handleSubmit}
      isFormValid={nom.length > 0}
    >
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l'institution</Label>
        <Input
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Entrez le nom de l'institution"
          required
        />
      </div>
    </GenericFormDialog>
  );
}
