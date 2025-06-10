
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MembreFormProps } from "../types";

export const InformationsPersonnelles: React.FC<MembreFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Nom</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="prenoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Prénoms</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dateNaissance"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Date de naissance</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lieuNaissance"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Lieu de naissance</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
