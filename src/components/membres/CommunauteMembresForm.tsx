import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { communauteMembresFormSchema, type CommunauteMembresFormValues } from "./types";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useParoisseCommunautes } from "@/hooks/useParoisseCommunautes";

interface CommunauteMembresFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CommunauteMembresFormValues) => void;
  paroisseId: string;
}

export function CommunauteMembresForm({ open, onOpenChange, onSubmit, paroisseId }: CommunauteMembresFormProps) {
  const { communautes, isLoading } = useParoisseCommunautes(paroisseId);
  const form = useForm<CommunauteMembresFormValues>({
    resolver: zodResolver(communauteMembresFormSchema),
    defaultValues: {
      communaute: "",
      hommes: 0,
      femmes: 0,
      garcons: 0,
      filles: 0,
      dateRecensement: new Date().toISOString().split("T")[0],
      observations: "",
    },
  });

  const handleSubmit = (data: CommunauteMembresFormValues) => {
    onSubmit(data);
    toast.success("Nombre de membres mis à jour avec succès");
    form.reset();
    onOpenChange(false);
  };

  const totalAdultes = form.watch("hommes") + form.watch("femmes");
  const totalEnfants = form.watch("garcons") + form.watch("filles");
  const totalGeneral = totalAdultes + totalEnfants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Mise à jour du nombre de membres
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Veuillez renseigner le nombre de membres par catégorie
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="communaute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Communauté</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
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

            <div className="space-y-4">
              <Card className="p-4 border border-gray-200 shadow-sm hover:shadow-none">
                <h3 className="font-medium text-gray-800 mb-3">Adultes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hommes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Hommes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="femmes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Femmes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="font-medium text-gray-800">Total: {totalAdultes}</span>
                </div>
              </Card>

              <Card className="p-4 border border-gray-200 shadow-sm hover:shadow-none">
                <h3 className="font-medium text-gray-800 mb-3">Enfants</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="garcons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Garçons</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Filles</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="font-medium text-gray-800">Total: {totalEnfants}</span>
                </div>
              </Card>

              <div className="text-right bg-gray-100 p-3 rounded-md">
                <span className="font-semibold text-lg text-gray-900">Total Général: {totalGeneral}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="dateRecensement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Date du recensement</FormLabel>
                  <FormControl>
                    <Input type="date" className="bg-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Observations</FormLabel>
                  <FormControl>
                    <Input className="bg-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
