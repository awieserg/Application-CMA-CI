import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Users,
  Building,
  MapPin,
  BookOpen,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavigationItem = {
  title: string;
  href: string;
  icon: any;
  children?: { title: string; href: string }[];
};

const navigationItems: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: Home,
  },
  {
    title: "Les Directions",
    href: "#",
    icon: Users,
    children: [
      { title: "Ressources Humaines", href: "/directions/rh" },
      { title: "Financier", href: "/directions/financier" },
      { title: "Enseignement & Formation", href: "/directions/enseignement" },
      { title: "Développement & Patrimoine", href: "/directions/developpement" },
      { title: "Mouvements & Associations", href: "/directions/mouvements" },
      { title: "Cultes, Arts & Culture", href: "/directions/cultes" },
      { title: "Évangélisation & Mission", href: "/directions/evangelisation" },
      { title: "Prière", href: "/directions/priere" },
    ],
  },
  { title: "Administrer Région", href: "/regions", icon: MapPin },
  { title: "Administrer District", href: "/districts", icon: Building },
  { title: "Administrer Paroisse", href: "/paroisses", icon: BookOpen },
  { title: "Paramètres", href: "/parametres", icon: Settings },
];

interface NavigationLinksProps {
  isOpen: boolean;
}

export const NavigationLinks = ({ isOpen }: NavigationLinksProps) => {
  const location = useLocation();
  const [directionsOpen, setDirectionsOpen] = useState(false);

  return (
    <nav className="space-y-1 px-2">
      {navigationItems.map((link) => {
        if (link.children) {
          return (
            <Collapsible
              key={link.title}
              open={directionsOpen}
              onOpenChange={setDirectionsOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1",
                    directionsOpen && "bg-gray-100"
                  )}
                >
                  <link.icon className={cn("h-5 w-5 mr-2", !isOpen && "mx-auto")} />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left">{link.title}</span>
                      {directionsOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {isOpen &&
                  link.children.map((child) => (
                    <Link key={child.title} to={child.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          location.pathname === child.href && "bg-gray-100"
                        )}
                      >
                        {child.title}
                      </Button>
                    </Link>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <Link key={link.title} to={link.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                location.pathname === link.href && "bg-gray-100"
              )}
            >
              <link.icon className={cn("h-5 w-5 mr-2", !isOpen && "mx-auto")} />
              {isOpen && <span>{link.title}</span>}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
