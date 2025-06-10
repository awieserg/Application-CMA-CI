
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface RegionData {
  id: string;
  code: string;
  nom: string;
  surintendant: string | null;
}

export function EditRegionDialog({ region }: { region: RegionData }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegionData>(region);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('regions')
        .update({
          code: formData.code,
          nom: formData.nom,
          surintendant: formData.surintendant
        })
        .eq('id', region.id);

      if (error) throw error;

      toast({
        title: "Région modifiée",
        description: "La région a été mise à jour avec succès"
      });
      
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['regions-list'] });
      queryClient.invalidateQueries({ queryKey: ['regions-count'] });
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
          <DialogTitle>Modifier la région</DialogTitle>
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
