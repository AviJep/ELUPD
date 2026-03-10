import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { ApiDataProvider } from "../contexts/ApiDataContext";

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-16 transition-all duration-300">
        <ApiDataProvider>
          <Outlet />
        </ApiDataProvider>
      </main>
    </div>
  );
}
