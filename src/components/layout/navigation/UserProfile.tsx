import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "../LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS } from "@/hooks/useRole";

interface UserProfileProps {
  isOpen: boolean;
}

export const UserProfile = ({ isOpen }: UserProfileProps) => {
  const { user } = useAuth();

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        {isOpen && user && (
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">
              {user.user_metadata?.full_name || user.email}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.role ? ROLE_LABELS[user.role] : 'Visiteur'}
            </span>
          </div>
        )}
      </div>
      <LogoutButton />
    </div>
  );
};