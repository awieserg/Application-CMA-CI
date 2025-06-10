
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface DistrictData {
  id: string;
  code: string;
  nom: string;
  region_id: string;
  surintendant: string | null;
  regions: {
    nom: string;
  };
}

export function EditDistrictDialog({ district }: { district: DistrictData }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: district.code,
    nom: district.nom,
    region_id: district.region_id,
    surintendant: district.surintendant
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: regions } = useQuery({
    queryKey: ['regions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('districts')
        .update({
          code: formData.code,
          nom: formData.nom,
          region_id: formData.region_id,
          surintendant: formData.surintendant
        })
        .eq('id', district.id);

      if (error) throw error;

      toast({
        title: "District modifié",
        description: "Le district a été mis à jour avec succès"
      });
      
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['districts-list'] });
      queryClient.invalidateQueries({ queryKey: ['districts-count'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le district</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Select
              value={formData.region_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, region_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une région" />
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
          <div className="space-y-2">
            <Label htmlFor="surintendant">Surintendant</Label>
            <Input
              id="surintendant"
              value={formData.surintendant || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, surintendant: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Modification..." : "Modifier"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
