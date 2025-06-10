
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button 
      variant="destructive" 
      onClick={logout}
      className="w-full"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
};
