
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ParoisseSettingsFormProps {
  paroisseId?: string;
}

export function ParoisseSettingsForm({ paroisseId }: ParoisseSettingsFormProps) {
  const [communautes, setCommunautes] = React.useState<{ id: string; nom: string }[]>([]);
  const [newCommunaute, setNewCommunaute] = React.useState("");
  const [settings, setSettings] = React.useState({
    nom: "",
    code: "",
    adresse: "",
    annee_fondation: "",
    email: "",
    telephone: ""
  });

  React.useEffect(() => {
    if (paroisseId) {
      loadParoisseData();
      loadCommunautes();
    }
  }, [paroisseId]);

  const loadParoisseData = async () => {
    if (!paroisseId) return;

    const { data: paroisseData, error: paroisseError } = await supabase
      .from('paroisses')
      .select('*')
      .eq('id', paroisseId)
      .single();

    if (paroisseError) {
      toast.error("Erreur lors du chargement des informations de la paroisse");
      return;
    }

    const { data: parametresData, error: parametresError } = await supabase
      .from('parametres_paroisses')
      .select('*')
      .eq('paroisse_id', paroisseId)
      .single();

    if (!parametresError && parametresData) {
      setSettings({
        ...paroisseData,
        ...parametresData
      });
    } else {
      setSettings(paroisseData);
    }
  };

  const loadCommunautes = async () => {
    if (!paroisseId) return;

    const { data, error } = await supabase
      .from('communautes')
      .select('*')
      .eq('paroisse_id', paroisseId);

    if (error) {
      toast.error("Erreur lors du chargement des communautés");
      return;
    }

    setCommunautes(data || []);
  };

  const handleAddCommunaute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paroisseId || !newCommunaute.trim()) return;

    const { error } = await supabase
      .from('communautes')
      .insert([{ 
        paroisse_id: paroisseId,
        nom: newCommunaute.trim()
      }]);

    if (error) {
      toast.error("Erreur lors de l'ajout de la communauté");
      return;
    }

    await loadCommunautes();
    setNewCommunaute("");
    toast.success("Communauté ajoutée avec succès");
  };

  const handleUpdateParoisse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paroisseId) return;

    const paroisseUpdate = {
      nom: settings.nom,
      code: settings.code,
      adresse: settings.adresse,
      email: settings.email,
      telephone: settings.telephone
    };

    const parametresUpdate = {
      paroisse_id: paroisseId,
      annee_fondation: parseInt(settings.annee_fondation),
      adresse: settings.adresse,
      email: settings.email,
      telephone: settings.telephone
    };

    const { error: paroisseError } = await supabase
      .from('paroisses')
      .update(paroisseUpdate)
      .eq('id', paroisseId);

    if (paroisseError) {
      toast.error("Erreur lors de la mise à jour de la paroisse");
      return;
    }

    const { error: parametresError } = await supabase
      .from('parametres_paroisses')
      .upsert(parametresUpdate, { 
        onConflict: 'paroisse_id'
      });

    if (parametresError) {
      toast.error("Erreur lors de la mise à jour des paramètres");
      return;
    }

    toast.success("Informations de la paroisse mises à jour avec succès");
  };

  const handleDeleteCommunaute = async (id: string) => {
    const { error } = await supabase
      .from('communautes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la suppression de la communauté");
      return;
    }

    await loadCommunautes();
    toast.success("Communauté supprimée avec succès");
  };

  const handleEditCommunaute = async (id: string, newName: string) => {
    const { error } = await supabase
      .from('communautes')
      .update({ nom: newName })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la modification de la communauté");
      return;
    }

    await loadCommunautes();
    toast.success("Communauté modifiée avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la paroisse</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateParoisse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la paroisse</label>
                <Input 
                  value={settings.nom}
                  onChange={(e) => setSettings(s => ({ ...s, nom: e.target.value }))}
                  placeholder="CMA Abobo Centre"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code paroisse</label>
                <Input 
                  value={settings.code}
                  onChange={(e) => setSettings(s => ({ ...s, code: e.target.value }))}
                  placeholder="PAR-ABC01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse</label>
                <Input 
                  value={settings.adresse || ""}
                  onChange={(e) => setSettings(s => ({ ...s, adresse: e.target.value }))}
                  placeholder="Quartier Abobo Centre, près du marché principal"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Année de fondation</label>
                <Input 
                  type="number"
                  value={settings.annee_fondation}
                  onChange={(e) => setSettings(s => ({ ...s, annee_fondation: e.target.value }))}
                  placeholder="1995"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))}
                  placeholder="contact@cma-abobocentre.org"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <Input 
                  value={settings.telephone || ""}
                  onChange={(e) => setSettings(s => ({ ...s, telephone: e.target.value }))}
                  placeholder="+225 07 12 34 56 78"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des communautés</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCommunaute} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la nouvelle communauté"
                value={newCommunaute}
                onChange={(e) => setNewCommunaute(e.target.value)}
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </form>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Communautés existantes</h4>
            <div className="grid gap-2">
              {communautes.map((communaute) => (
                <div 
                  key={communaute.id}
                  className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center"
                >
                  <span>{communaute.nom}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newName = window.prompt("Nouveau nom de la communauté", communaute.nom);
                        if (newName) handleEditCommunaute(communaute.id, newName);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Voulez-vous vraiment supprimer cette communauté ?")) {
                          handleDeleteCommunaute(communaute.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
