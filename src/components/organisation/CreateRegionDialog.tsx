
import * as React from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GenericFormDialog } from "@/components/common/GenericFormDialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

function generateRegionCode(name: string) {
  if (!name) return "";
  const cleaned = name.trim().toUpperCase().replace(/[^A-Z]/g, "");
  return "REG-" + cleaned.slice(0, 5) + Math.floor(Math.random() * 1000);
}

export function CreateRegionDialog() {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setCode(generateRegionCode(name));
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('regions')
        .insert({ nom: name, code: code });

      if (error) throw error;

      toast({
        title: "Région créée avec succès",
        description: `La région ${name} a été créée.`
      });
      
      setName("");
      setCode("");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création de la région.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !!name;

  return (
    <GenericFormDialog
      title="Créer une région"
      description="Remplissez le formulaire pour créer une nouvelle région."
      buttonLabel="Créer une région"
      buttonIcon={<Plus className="w-4 h-4" />}
      buttonClassName="bg-cma-blue"
      onSubmit={handleSubmit}
      isLoading={loading}
      isFormValid={isFormValid}
    >
      <Input
        autoFocus
        required
        placeholder="Nom de la région"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div>
        <label className="text-sm font-medium text-muted-foreground">Code généré</label>
        <Input value={code} readOnly className="bg-gray-100 mt-1" />
      </div>
    </GenericFormDialog>
  );
}
