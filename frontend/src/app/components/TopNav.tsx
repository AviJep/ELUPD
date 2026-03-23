import { Bell, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DHSUD NIR" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <h1 className="text-base md:text-lg font-semibold text-gray-900">
                DHSUD NIR — ELUPD System
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                CLUP & PDPFP Status Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
