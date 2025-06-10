
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ParoisseOverviewProps {
  id: string;
}

export const ParoisseOverview: React.FC<ParoisseOverviewProps> = ({ id }) => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');

  const { data: paroisse } = useQuery({
    queryKey: ['paroisse', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paroisses')
        .select(`
          *,
          districts (
            nom,
            regions (
              nom
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmitHelp = () => {
    if (helpMessage.trim() === '') {
      toast.error('Veuillez saisir votre message');
      return;
    }
    
    // Encoder la question pour l'URL
    const encodedQuestion = encodeURIComponent(helpMessage);
    
    // Ouvrir Microsoft Copilot avec la question
    window.open(`https://copilot.microsoft.com/search?q=${encodedQuestion}`, '_blank');
    
    // Réinitialiser l'état local
    setHelpMessage('');
    setHelpDialogOpen(false);
    
    toast.success('Redirection vers Microsoft Copilot');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">Informations générales</h2>
        <Button onClick={() => setHelpDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <ExternalLink className="w-4 h-4 mr-2" />
          Je peux t'aider
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Nom:</span>
                <span>{paroisse?.nom || 'Non défini'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">District:</span>
                <span>{paroisse?.districts?.nom || 'Non défini'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Région:</span>
                <span>{paroisse?.districts?.regions?.nom || 'Non défini'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Pasteur:</span>
                <span>{paroisse?.pasteur || 'Non assigné'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Année de fondation:</span>
                <span>{paroisse?.date_creation ? new Date(paroisse.date_creation).getFullYear() : 'Non défini'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Adresse:</span>
                <span>{paroisse?.adresse || 'Non défini'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Téléphone:</span>
                <span>{paroisse?.telephone || 'Non défini'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Email:</span>
                <span>{paroisse?.email || 'Non défini'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-800">Besoin d'aide?</DialogTitle>
            <DialogDescription>
              Décrivez votre problème ou votre question et nous vous aiderons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="help-message" className="font-semibold">Votre message</Label>
              <Textarea 
                id="help-message" 
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
                placeholder="Comment puis-je vous aider?" 
                className="h-32"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setHelpDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmitHelp}>
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
