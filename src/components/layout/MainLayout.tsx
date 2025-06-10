
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-2 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-green-400 font-[Playfair Display]">
              Gestion Administrative de la CMA-CI
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
