import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="hover:bg-gray-100"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
    </header>
  );
}
