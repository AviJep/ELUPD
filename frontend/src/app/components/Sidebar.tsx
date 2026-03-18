import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BarChart3,
  ClipboardCheck,
  ScrollText,
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
  { path: "/logs", label: "System Logs", icon: ScrollText },
  { path: "/about", label: "About the Application", icon: Info },
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
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-[#003087] text-white">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DHSUD NIR" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5" />
              <div>
                <p className="text-sm font-semibold">DHSUD NIR</p>
                <p className="text-xs text-blue-200">ELUPD System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2026 DHSUD</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
