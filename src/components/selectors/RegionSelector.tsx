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

interface RegionSelectorProps {
  onRegionSelect: (regionId: string) => void;
  currentRegionId?: string;
}

export const RegionSelector = ({ onRegionSelect, currentRegionId }: RegionSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: regions, isLoading } = useQuery({
    queryKey: ['regions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredRegions = regions?.filter(region => 
    region.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Chargement des régions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Dropdown Select */}
        <Select 
          value={currentRegionId || ""}
          onValueChange={onRegionSelect}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Sélectionner une région" />
          </SelectTrigger>
          <SelectContent>
            {regions?.map((region) => (
              region.id ? (
                <SelectItem key={region.id} value={region.id}>
                  {region.nom}
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
            placeholder="Rechercher une région par nom ou code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Search Results */}
      {searchQuery && filteredRegions && filteredRegions.length > 0 && (
        <div className="border rounded-lg divide-y">
          {filteredRegions.map((region) => (
            <Button
              key={region.id}
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-left ${
                currentRegionId === region.id ? 'bg-muted' : ''
              }`}
              onClick={() => onRegionSelect(region.id)}
            >
              <div>
                <div className="font-medium">{region.nom}</div>
                <div className="text-sm text-muted-foreground">{region.code}</div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};