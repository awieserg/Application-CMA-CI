import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRegionDialog } from "@/components/organisation/CreateRegionDialog";
import { CreateDistrictDialog } from "@/components/organisation/CreateDistrictDialog";
import { CreateParishDialog } from "@/components/organisation/CreateParishDialog";
import { CreateInstitutionDialog } from "@/components/organisation/CreateInstitutionDialog";
import { Building, BookOpen, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ROLE_LABELS } from "@/hooks/useRole";
import type { UserRole } from "@/types/auth";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const adminFormSchema = z.object({
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(Object.keys(ROLE_LABELS) as [UserRole, ...UserRole[]]),
  departement_id: z.string().optional(),
  region_id: z.string().optional(),
  district_id: z.string().optional(),
  paroisse_id: z.string().optional(),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

export function OrganizationTab() {
  const [showRegions, setShowRegions] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showParishes, setShowParishes] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role: "visitor",
    },
  });

  const role = form.watch("role");

  // Fetch entities for admin form
  const { data: entities } = useQuery({
    queryKey: ['entities', role],
    queryFn: async () => {
      if (!role || role === 'president' || role === 'secretary_general' || role === 'visitor' || 
          role === 'missionary' || role === 'chaplain' || role === 'technical_assistant') {
        return [];
      }

      let query;
      switch (role) {
        case 'director':
          query = supabase.from('departements').select('id, nom, code');
          break;
        case 'region_superintendent':
          query = supabase.from('regions').select('id, nom, code');
          break;
        case 'district_superintendent':
          query = supabase.from('districts').select('id, nom, code, regions(nom)');
          break;
        case 'parish_intendant':
        case 'community_pastor':
        case 'assistant_pastor':
          query = supabase.from('paroisses').select('id, nom, code, districts(nom, regions(nom))');
          break;
        default:
          return [];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!role && !['president', 'secretary_general', 'visitor', 'missionary', 'chaplain', 'technical_assistant'].includes(role)
  });

  const onSubmit = async (data: AdminFormValues) => {
    try {
      setIsSubmitting(true);

      // Generate UUID for the new user
      const userId = uuidv4();

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(data.password, salt);

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          full_name: data.full_name,
          email: data.email,
          password_hash,
          role: data.role,
          departement_id: data.departement_id,
          region_id: data.region_id,
          district_id: data.district_id,
          paroisse_id: data.paroisse_id,
          is_active: true
        });

      if (profileError) throw profileError;

      toast.success("Administrateur créé avec succès");
      setShowAdminForm(false);
      form.reset();
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(`Erreur lors de la création: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEntityLabel = (entity: any) => {
    switch (role) {
      case 'director':
        return `${entity.nom} (${entity.code})`;
      case 'region_superintendent':
        return `${entity.nom} (${entity.code})`;
      case 'district_superintendent':
        return `${entity.nom} (${entity.regions?.nom})`;
      case 'parish_intendant':
      case 'community_pastor':
      case 'assistant_pastor':
        return `${entity.nom} (${entity.districts?.nom}, ${entity.districts?.regions?.nom})`;
      default:
        return entity.nom;
    }
  };

  const needsEntity = !['president', 'secretary_general', 'visitor', 'missionary', 'chaplain', 'technical_assistant'].includes(role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organisation de l'église</CardTitle>
        <CardDescription>
          Gérez la structure organisationnelle de l'église.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-6">
          <CreateRegionDialog />
          <CreateDistrictDialog />
          <CreateParishDialog />
          <CreateInstitutionDialog />
          <Button 
            onClick={() => setShowAdminForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Inscrire un administrateur
          </Button>
        </div>

        {/* Admin registration form */}
        <Dialog open={showAdminForm} onOpenChange={setShowAdminForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Inscription d'un administrateur</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nom complet" />
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
                        <Input {...field} type="email" placeholder="Email" />
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
                        <Input {...field} type="password" placeholder="Mot de passe" />
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
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {needsEntity && (
                  <FormField
                    control={form.control}
                    name={
                      role === 'director' ? 'departement_id' :
                      role === 'region_superintendent' ? 'region_id' :
                      role === 'district_superintendent' ? 'district_id' :
                      'paroisse_id'
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {role === 'director' ? 'Département' :
                           role === 'region_superintendent' ? 'Région' :
                           role === 'district_superintendent' ? 'District' :
                           'Paroisse'}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Sélectionner ${
                                role === 'director' ? 'un département' :
                                role === 'region_superintendent' ? 'une région' :
                                role === 'district_superintendent' ? 'un district' :
                                'une paroisse'
                              }`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {entities?.map((entity) => (
                              <SelectItem key={entity.id} value={entity.id}>
                                {getEntityLabel(entity)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end gap-4">
                  <Button 
                    type="submit" 
                    className="bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création en cours..." : "Inscrire l'administrateur"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAdminForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Reste du contenu... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="h-36 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer hover-card"
            onClick={() => setShowRegions(true)}
          >
            <MapPin className="h-8 w-8 mb-2 text-game-primary game-icon" />
            <h3 className="font-semibold text-center">Régions</h3>
          </Card>
          <Card 
            className="h-36 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer hover-card"
            onClick={() => setShowDistricts(true)}
          >
            <Building className="h-8 w-8 mb-2 text-game-secondary game-icon" />
            <h3 className="font-semibold text-center">Districts</h3>
          </Card>
          <Card 
            className="h-36 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer hover-card"
            onClick={() => setShowParishes(true)}
          >
            <BookOpen className="h-8 w-8 mb-2 text-game-tertiary game-icon" />
            <h3 className="font-semibold text-center">Paroisses</h3>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}