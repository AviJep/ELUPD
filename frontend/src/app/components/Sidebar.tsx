import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPinned,
  BarChart3,
  ClipboardCheck,
  Upload,
  Archive,
  Database,
  ScrollText,
  Info,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import logo from "../../assets/logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/map-intelligence", label: "Map Intelligence", icon: MapPinned },
  { path: "/statistics", label: "Statistics and Analytics", icon: BarChart3 },
  { path: "/compliance", label: "Compliance Monitoring", icon: ClipboardCheck },
  { path: "/data-import-export", label: "Data Import and Export", icon: Upload },
  { path: "/archive", label: "Archive Center", icon: Archive },
  { path: "/crud", label: "CRUD Management", icon: Database },
  { path: "/logs", label: "System Logs", icon: ScrollText },
  { path: "/about", label: "About the Application", icon: Info },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg z-[9999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="DHSUD logo"
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">DHSUD</p>
                <p className="text-xs text-gray-500">HREDR System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
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
