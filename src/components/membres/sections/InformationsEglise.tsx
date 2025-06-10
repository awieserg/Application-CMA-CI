
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MembreFormProps, ministereOptions } from "../types";
import { useParoisseCommunautes } from "@/hooks/useParoisseCommunautes";
import { Checkbox } from "@/components/ui/checkbox";

export const InformationsEglise: React.FC<MembreFormProps> = ({ control, paroisseId }) => {
  const { communautes, isLoading } = useParoisseCommunautes(paroisseId || "");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="communaute"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Communauté</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une communauté" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {communautes?.map((communaute) => (
                  <SelectItem key={communaute.id} value={communaute.nom}>
                    {communaute.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dateAdhesion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">
              Date d'adhésion
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="dateBapteme"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">
              Date de baptême
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lieuBapteme"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">
              Lieu de baptême
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <FormField
          control={control}
          name="ministeres"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-semibold">Ministères</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {ministereOptions.map((ministere) => (
                  <FormField
                    key={ministere}
                    control={control}
                    name="ministeres"
                    render={({ field }) => (
                      <FormItem
                        key={ministere}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(ministere)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value || [], ministere])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== ministere
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {ministere}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

