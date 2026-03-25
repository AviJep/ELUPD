import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BarChart3,
  ClipboardCheck,
  BookOpenCheck,
  Archive,
  Info,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Municipality } from "../types";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  municipalities?: Municipality[];
  onMunicipalitiesUpdate?: (municipalities: Municipality[]) => void;
}

// Navigation items for the router-based layout
const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/statistics", label: "Statistics and Analytics", icon: BarChart3 },
  { path: "/compliance", label: "Compliance Monitoring", icon: ClipboardCheck },
  { path: "/definition-status", label: "Definition Status", icon: BookOpenCheck },
  { path: "/archives", label: "Archive Center", icon: Archive },
  { path: "/about", label: "About", icon: Info },
];

export function Sidebar({ isOpen, onClose, municipalities, onMunicipalitiesUpdate }: SidebarProps) {
  // If props include municipalities, render the standalone sidebar with municipality management
  if (municipalities && onMunicipalitiesUpdate) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-left">
            Add New Municipality
          </button>
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-left">
            Export Data
          </button>
          <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-left">
            Generate Report
          </button>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">Total: {municipalities.length} municipalities</p>
        </div>
      </div>
    );
  }

  // Default router-based sidebar - try to use useLocation, fallback if no router
  let isActive = (path: string) => false;
  
  try {
    const loc = useLocation();
    isActive = (path: string) => loc.pathname === path;
  } catch {
    // No router context
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-[1px] z-40 transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 md:translate-x-0 md:z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#003087] via-[#0a4aa3] to-[#026c7c] text-white">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DHSUD NIR" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-md" />
              <div>
                <p className="text-sm font-bold tracking-wide">DHSUD NIR</p>
                <p className="text-xs text-blue-100 font-medium">ELUPD System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Modules</p>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#003087]" />
                    )}
                    <Icon className={`h-5 w-5 ${isActive(item.path) ? "text-[#003087]" : "text-slate-500 group-hover:text-slate-700"}`} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-white/70">
            <div className="text-xs text-slate-500">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2026 DHSUD</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
