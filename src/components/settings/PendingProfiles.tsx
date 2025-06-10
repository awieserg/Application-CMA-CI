
import { useState } from "react";
import { UserRole, ROLE_LABELS } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX } from "lucide-react";

// Données utilisateur simulées
const MOCK_USERS = [
  { 
    id: "1", 
    full_name: "Jean Dupont", 
    email: "jean@example.com", 
    role: "director" as UserRole, 
    is_validated: true 
  },
  { 
    id: "2", 
    full_name: "Marie Martin", 
    email: "marie@example.com", 
    role: "region_superintendent" as UserRole, 
    is_validated: true 
  },
  { 
    id: "3", 
    full_name: "Paul Durand", 
    email: "paul@example.com", 
    role: "visitor" as UserRole, 
    is_validated: false 
  }
];

interface UserData {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_validated: boolean;
}

export const PendingProfiles = () => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string[]>([]);
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    setProcessing(prev => [...prev, userId]);
    try {
      // Version simplifiée sans Supabase
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      );

      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
      });
    } finally {
      setProcessing(prev => prev.filter(id => id !== userId));
    }
  };

  const handleToggleValidation = async (userId: string, isCurrentlyValidated: boolean) => {
    setProcessing(prev => [...prev, userId]);
    try {
      // Version simplifiée sans Supabase
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, is_validated: !isCurrentlyValidated } : user
        )
      );

      toast({
        title: isCurrentlyValidated ? "Accès révoqué" : "Utilisateur activé",
        description: isCurrentlyValidated 
          ? "L'accès de l'utilisateur a été révoqué" 
          : "L'utilisateur a été activé avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
      });
    } finally {
      setProcessing(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Utilisateurs du système ({users.length})
      </h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div>
              <h4 className="font-medium">{user.full_name}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${user.is_validated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.is_validated ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                defaultValue={user.role}
                onValueChange={(value: UserRole) => handleUpdateUserRole(user.id, value)}
                disabled={processing.includes(user.id)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([role, label]) => (
                    <SelectItem key={role} value={role}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleToggleValidation(user.id, user.is_validated)}
                disabled={processing.includes(user.id)}
                variant={user.is_validated ? "destructive" : "default"}
                size="sm"
                className="ml-2"
              >
                {user.is_validated ? (
                  <>
                    <UserX className="w-4 h-4 mr-1" />
                    Révoquer
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-1" />
                    Activer
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
