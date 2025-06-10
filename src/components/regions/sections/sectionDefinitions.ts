import React from "react";
import { Eye, Users, Building, Calendar, FileText, Settings } from "lucide-react";

export interface Section {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const sectionDefinitions: Section[] = [
  { value: "vue-densemble", label: "Vue d'ensemble", icon: React.createElement(Eye, { className: "w-4 h-4" }) },
  { value: "districts", label: "Districts", icon: React.createElement(Building, { className: "w-4 h-4" }) },
  { value: "serviteurs", label: "Serviteurs", icon: React.createElement(Users, { className: "w-4 h-4" }) },
  { value: "activites", label: "Activités", icon: React.createElement(Calendar, { className: "w-4 h-4" }) },
  { value: "rapports", label: "Rapports", icon: React.createElement(FileText, { className: "w-4 h-4" }) },
  { value: "parametres", label: "Paramètres", icon: React.createElement(Settings, { className: "w-4 h-4" }) },
];