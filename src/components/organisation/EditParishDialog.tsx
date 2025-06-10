
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

interface ParishData {
  id: string;
  code: string;
  nom: string;
  district_id: string;
  pasteur: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  districts: {
    nom: string;
    regions: {
      nom: string;
    };
  };
}

export function EditParishDialog({ parish }: { parish: ParishData }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: parish.code,
    nom: parish.nom,
    district_id: parish.district_id,
    pasteur: parish.pasteur,
    email: parish.email,
    telephone: parish.telephone,
    adresse: parish.adresse
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: districts } = useQuery({
    queryKey: ['districts-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select('*, regions(nom)')
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
        .from('paroisses')
        .update({
          code: formData.code,
          nom: formData.nom,
          district_id: formData.district_id,
          pasteur: formData.pasteur,
          email: formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse
        })
        .eq('id', parish.id);

      if (error) throw error;

      toast({
        title: "Paroisse modifiée",
        description: "La paroisse a été mise à jour avec succès"
      });
      
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['parishes-list'] });
      queryClient.invalidateQueries({ queryKey: ['parishes-count'] });
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
          <DialogTitle>Modifier la paroisse</DialogTitle>
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
            <Label htmlFor="district">District</Label>
            <Select
              value={formData.district_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, district_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un district" />
              </SelectTrigger>
              <SelectContent>
                {districts?.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.nom} ({district.regions.nom})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pasteur">Pasteur</Label>
            <Input
              id="pasteur"
              value={formData.pasteur || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, pasteur: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              value={formData.telephone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
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
