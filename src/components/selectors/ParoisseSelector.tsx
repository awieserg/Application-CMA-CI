import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParoisseSelectorProps {
  onParoisseSelect: (paroisseId: string) => void;
  currentParoisseId?: string;
}

export const ParoisseSelector = ({ onParoisseSelect, currentParoisseId }: ParoisseSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: paroisses, isLoading } = useQuery({
    queryKey: ['paroisses-list'],
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
        .order('nom');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredParoisses = paroisses?.filter(paroisse => 
    paroisse.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paroisse.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Chargement des paroisses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Dropdown Select */}
        <Select 
          value={currentParoisseId || ""}
          onValueChange={onParoisseSelect}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Sélectionner une paroisse" />
          </SelectTrigger>
          <SelectContent>
            {paroisses?.map((paroisse) => (
              paroisse.id ? (
                <SelectItem key={paroisse.id} value={paroisse.id}>
                  {paroisse.nom} ({paroisse.districts?.nom || 'Non défini'})
                </SelectItem>
              ) : null
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une paroisse par nom ou code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Search Results */}
      {searchQuery && filteredParoisses && filteredParoisses.length > 0 && (
        <div className="border rounded-lg divide-y">
          {filteredParoisses.map((paroisse) => (
            <Button
              key={paroisse.id}
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-left ${
                currentParoisseId === paroisse.id ? 'bg-muted' : ''
              }`}
              onClick={() => onParoisseSelect(paroisse.id)}
            >
              <div>
                <div className="font-medium">{paroisse.nom}</div>
                <div className="text-sm text-muted-foreground">{paroisse.code}</div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};