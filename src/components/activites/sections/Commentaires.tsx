
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const Commentaires = ({ control }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="commentaires"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Commentaires (optionnel)</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Commentaires sur l'activité" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="autre_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-semibold">Autres informations (optionnel)</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Autres informations pertinentes" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
