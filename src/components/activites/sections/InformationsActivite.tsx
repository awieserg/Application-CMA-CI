
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useParoisseCommunautes } from "@/hooks/useParoisseCommunautes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export const InformationsActivite = ({ control, paroisseId }) => {
  const { communautes } = useParoisseCommunautes(paroisseId);
  const [isAutreCommunaute, setIsAutreCommunaute] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Type d'activité</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Type d'activité pastorale" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={fr}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="communaute"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Communauté</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                setIsAutreCommunaute(value === "autre");
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une communauté" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {communautes?.map((communaute) => (
                    <SelectItem key={communaute.id} value={communaute.nom}>
                      {communaute.nom}
                    </SelectItem>
                  ))}
                  <SelectItem value="autre">Autre</SelectItem>
                </ScrollArea>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lieu"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Lieu (optionnel)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Lieu de l'activité" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
