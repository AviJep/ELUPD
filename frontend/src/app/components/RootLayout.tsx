import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DataProvider } from "../DataContext";

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DataProvider>
    <div className="min-h-screen bg-gray-50">
      {/* Floating hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 hover:bg-white/20 h-10 w-10"
      >
        <Menu className="h-6 w-6 text-white" />
      </Button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="transition-all duration-300">
        <Outlet />
      </main>
    </div>
    </DataProvider>
  );
}
