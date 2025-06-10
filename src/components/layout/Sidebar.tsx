import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { UserProfile } from "./navigation/UserProfile";

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <div
      className={cn(
        "bg-white h-full flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen ? (
          <div className="font-bold text-xl text-cma-blue font-['Playfair_Display']">CMA Église</div>
        ) : (
          <div className="font-bold text-xl text-cma-blue font-['Playfair_Display']">CMA</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto py-4">
        <NavigationLinks isOpen={isOpen} />
      </div>
      <UserProfile isOpen={isOpen} />
    </div>
  );
};