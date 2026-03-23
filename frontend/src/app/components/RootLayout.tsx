import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { LGUProvider } from "../LGUContext";

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LGUProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-[#003087] text-white hover:bg-[#002566] shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Sidebar - Handles its own responsive visibility */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300 md:pl-72 w-full">
          <Outlet />
        </main>
      </div>
    </LGUProvider>
  );
}
