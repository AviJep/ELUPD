import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DataProvider } from "../DataContext";
import { LGUProvider } from "../LGUContext";

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LGUProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Floating hamburger button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 h-11 w-11 rounded-xl border border-white/30 bg-[#003087] text-white shadow-lg shadow-blue-900/30 hover:bg-[#0a4aa3] md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="transition-all duration-300 md:ml-72">
            <Outlet />
          </main>
        </div>
      </DataProvider>
    </LGUProvider>
  );
}
