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

interface DistrictSelectorProps {
  onDistrictSelect: (districtId: string) => void;
  currentDistrictId?: string;
}

export const DistrictSelector = ({ onDistrictSelect, currentDistrictId }: DistrictSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: districts, isLoading } = useQuery({
    queryKey: ['districts-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select(`
          *,
          regions (
            nom
          )
        `)
        .order('nom');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredDistricts = districts?.filter(district => 
    district.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Chargement des districts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Dropdown Select */}
        <Select 
          value={currentDistrictId || ""}
          onValueChange={onDistrictSelect}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Sélectionner un district" />
          </SelectTrigger>
          <SelectContent>
            {districts?.map((district) => (
              district.id ? (
                <SelectItem key={district.id} value={district.id}>
                  {district.nom} ({district.regions?.nom || 'Non défini'})
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
            placeholder="Rechercher un district par nom ou code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Search Results */}
      {searchQuery && filteredDistricts && filteredDistricts.length > 0 && (
        <div className="border rounded-lg divide-y">
          {filteredDistricts.map((district) => (
            <Button
              key={district.id}
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-left ${
                currentDistrictId === district.id ? 'bg-muted' : ''
              }`}
              onClick={() => onDistrictSelect(district.id)}
            >
              <div>
                <div className="font-medium">{district.nom}</div>
                <div className="text-sm text-muted-foreground">{district.code}</div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};