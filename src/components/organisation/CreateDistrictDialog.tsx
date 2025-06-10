
import * as React from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GenericFormDialog } from "@/components/common/GenericFormDialog";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

function generateDistrictCode(name: string, regionId: string) {
  if (!name) return "";
  const cleaned = name.trim().toUpperCase().replace(/[^A-Z]/g, "");
  return "DIS-" + cleaned.slice(0, 5) + (regionId?.slice(0, 3) || "0") + Math.floor(Math.random() * 1000);
}

export function CreateDistrictDialog() {
  const [name, setName] = React.useState("");
  const [regionId, setRegionId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkPermission } = usePermissions();

  // Fetch regions from Supabase
  const { data: regions, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('id, nom')
        .order('nom');
      
      if (error) throw error;
      return data;
    }
  });

  React.useEffect(() => {
    setCode(generateDistrictCode(name, regionId));
  }, [name, regionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('districts')
        .insert({
          nom: name,
          code: code,
          region_id: regionId
        });

      if (error) throw error;

      toast({
        title: "District créé avec succès",
        description: `Le district ${name} a été créé.`
      });
      
      setName("");
      setRegionId("");
      setCode("");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création du district.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !!name && !!regionId;

  return (
    <GenericFormDialog
      title="Créer un district"
      description="Remplissez le formulaire pour créer un nouveau district."
      buttonLabel="Créer un district"
      buttonIcon={<Plus className="w-4 h-4" />}
      buttonClassName="bg-cma-blue"
      onSubmit={handleSubmit}
      isLoading={loading}
      isFormValid={isFormValid}
    >
      <Input
        autoFocus
        required
        placeholder="Nom du district"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div>
        <label className="block mb-1 text-sm font-medium text-muted-foreground">
          Région associée
        </label>
        <Select value={regionId} onValueChange={setRegionId} required>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une région" />
          </SelectTrigger>
          <SelectContent>
            {regions?.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Code généré</label>
        <Input value={code} readOnly className="bg-gray-100 mt-1" />
      </div>
    </GenericFormDialog>
  );
}
