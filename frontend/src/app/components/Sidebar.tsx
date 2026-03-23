import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  TrendingUp,
  FileStack,
  Home,
  BarChart3,
  ScrollText,
  Info,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Full navigation items for the unified ELUPD system
const navigationItems = [
  { path: "/", label: "Dashboard Overview", icon: LayoutDashboard },
  { path: "/directory", label: "LGU Directory", icon: Building2 },
  { path: "/clup", label: "CLUP Status", icon: ClipboardCheck },
  { path: "/clup-progress", label: "CLUP Progress", icon: TrendingUp },
  { path: "/pdpfp", label: "PDPFP Status", icon: FileStack },
  { path: "/housing", label: "Housing Projects", icon: Home },
  { path: "/statistics", label: "Statistics and Analytics", icon: BarChart3 },
  { path: "/logs", label: "System Logs", icon: ScrollText },
  { path: "/about", label: "About System", icon: Info },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-[#003087] text-white">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DHSUD NIR" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 shadow-sm" />
              <div>
                <p className="text-sm font-black tracking-tight">DHSUD NIR</p>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">ELUPD System</p>
              </div>
            </div>
            {/* Close Button - Mobile Only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
            <div className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-white text-[#003087] font-black shadow-md border border-blue-50 scale-[1.02]"
                        : "text-gray-500 hover:bg-white hover:text-[#003087] hover:shadow-sm"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${active ? "bg-blue-50" : "bg-transparent"}`}>
                      <Icon className={`h-4 w-4 ${active ? "text-[#003087]" : ""}`} />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <p>Version 1.6.1 (Progress Added)</p>
              <p className="mt-1 opacity-60">© 2026 DHSUD NIR</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
