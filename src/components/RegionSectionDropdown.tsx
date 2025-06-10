import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type Section = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  sections: Section[];
  activeSection: string;
  onSectionChange: (val: string) => void;
};

export const RegionSectionDropdown: React.FC<Props> = ({ sections, activeSection, onSectionChange }) => {
  const activeLabel = sections.find((s) => s.value === activeSection)?.label || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[190px] justify-between h-12 px-4 rounded-lg border-cma-blue text-cma-blue bg-white shadow font-semibold"
        >
          {activeLabel}
          <ChevronDown className="ml-2 w-4 h-4 text-cma-blue" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="z-50 min-w-[200px]">
        {sections.map((section) => (
          <DropdownMenuItem
            key={section.value}
            onSelect={() => onSectionChange(section.value)}
            className={`${section.value === activeSection ? "bg-cma-blue/10 font-bold" : ""} cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              {section.icon}
              {section.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};