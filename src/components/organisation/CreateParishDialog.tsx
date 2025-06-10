
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

function generateParishCode(name: string, districtId: string) {
  if (!name) return "";
  const cleaned = name.trim().toUpperCase().replace(/[^A-Z]/g, "");
  return "PAR-" + cleaned.slice(0, 5) + (districtId?.slice(0, 3) || "0") + Math.floor(Math.random() * 1000);
}

export function CreateParishDialog() {
  const [name, setName] = React.useState("");
  const [regionId, setRegionId] = React.useState("");
  const [districtId, setDistrictId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkPermission } = usePermissions();

  // Fetch regions
  const { data: regions, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('id, nom, code')
        .order('nom');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch districts based on selected region
  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts', regionId],
    queryFn: async () => {
      if (!regionId) return [];
      const { data, error } = await supabase
        .from('districts')
        .select('id, nom, code')
        .eq('region_id', regionId)
        .order('nom');
      
      if (error) throw error;
      return data;
    },
    enabled: !!regionId
  });

  React.useEffect(() => {
    if (districtId) {
      setCode(generateParishCode(name, districtId));
    }
  }, [name, districtId]);

  // Reset district when region changes
  React.useEffect(() => {
    setDistrictId("");
  }, [regionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('paroisses')
        .insert({
          nom: name,
          code: code,
          district_id: districtId
        });

      if (error) throw error;
      
      toast({
        title: "Paroisse créée avec succès",
        description: `La paroisse ${name} a été créée.`
      });
      
      setName("");
      setRegionId("");
      setDistrictId("");
      setCode("");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création de la paroisse.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !!name && !!districtId;

  return (
    <GenericFormDialog
      title="Créer une paroisse"
      description="Remplissez le formulaire pour créer une nouvelle paroisse."
      buttonLabel="Créer une paroisse"
      buttonIcon={<Plus className="w-4 h-4" />}
      buttonClassName="bg-cma-blue"
      onSubmit={handleSubmit}
      isLoading={loading}
      isFormValid={isFormValid}
    >
      <Input
        autoFocus
        required
        placeholder="Nom de la paroisse"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div>
        <label className="block mb-1 text-sm font-medium text-muted-foreground">
          Région
        </label>
        <Select value={regionId} onValueChange={setRegionId} required>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une région" />
          </SelectTrigger>
          <SelectContent>
            {regions?.map((region: any) => (
              <SelectItem key={region.id} value={region.id}>
                {region.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-muted-foreground">
          District
        </label>
        <Select value={districtId} onValueChange={setDistrictId} required disabled={!regionId}>
          <SelectTrigger>
            <SelectValue placeholder={regionId ? "Choisir un district" : "Sélectionnez d'abord une région"} />
          </SelectTrigger>
          <SelectContent>
            {districts?.map((district: any) => (
              <SelectItem key={district.id} value={district.id}>
                {district.nom}
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
