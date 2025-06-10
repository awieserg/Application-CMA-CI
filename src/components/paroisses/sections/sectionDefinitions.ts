
import React from "react";
import { Eye, Users, PieChart, Calendar, BookOpen, Building, FileText, BookUser, Settings } from "lucide-react";

export interface Section {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const sectionDefinitions: Section[] = [
  { value: "vue-densemble", label: "Vue d'ensemble", icon: React.createElement(Eye, { className: "w-4 h-4" }) },
  { value: "membres", label: "Membres", icon: React.createElement(Users, { className: "w-4 h-4" }) },
  { value: "nb-fideles", label: "Nombre de fidèles", icon: React.createElement(PieChart, { className: "w-4 h-4" }) },
  { value: "activite-pastorale", label: "Activité pastorale", icon: React.createElement(Calendar, { className: "w-4 h-4" }) },
  { value: "services", label: "Services religieux", icon: React.createElement(BookOpen, { className: "w-4 h-4" }) },
  { value: "patrimoine", label: "Patrimoine", icon: React.createElement(Building, { className: "w-4 h-4" }) },
  { value: "finance", label: "Finance", icon: React.createElement(FileText, { className: "w-4 h-4" }) },
  { value: "rapport", label: "Rapport", icon: React.createElement(FileText, { className: "w-4 h-4" }) },
  { value: "annuaire", label: "Annuaire", icon: React.createElement(BookUser, { className: "w-4 h-4" }) },
  { value: "parametres", label: "Paramètres", icon: React.createElement(Settings, { className: "w-4 h-4" }) },
];
