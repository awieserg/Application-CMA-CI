import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABELS } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const createUserSchema = z.object({
  email: z.string().email("Email invalide"),
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum([
    "president",
    "secretary_general",
    "director",
    "region_superintendent",
    "district_superintendent",
    "parish_intendant",
    "community_pastor",
    "missionary",
    "chaplain",
    "technical_assistant",
    "visitor"
  ])
});

type CreateUserValues = z.infer<typeof createUserSchema>;

export const CreateUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      role: "visitor",
    },
  });

  const onSubmit = async (data: CreateUserValues) => {
    setIsLoading(true);
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(data.password, salt);

      // Create user profile
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: uuidv4(),
          email: data.email,
          full_name: data.full_name,
          password_hash,
          role: data.role,
          is_active: false
        });

      if (error) throw error;

      toast({
        title: "Administrateur créé avec succès",
        description: "L'administrateur pourra se connecter une fois son compte activé"
      });

      form.reset();
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Inscrire un administrateur</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="john.doe@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Minimum 8 caractères" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([role, label]) => (
                      <SelectItem key={role} value={role}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Création en cours..." : "Créer l'administrateur"}
          </Button>
        </form>
      </Form>
    </div>
  );
};