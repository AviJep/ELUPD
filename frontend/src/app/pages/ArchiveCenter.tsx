import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, RotateCcw, Trash2, Eye, Archive, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { EmptyState } from "../components/EmptyState";
import { useLgus } from "../LGUContext";

export function ArchiveCenter() {
  const { isLoading, lgus } = useLgus();
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name">("recent");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // For this refactor, since our LGU state doesn't have a separate "archived" collection yet,
  // we'll assume "expired" or "Not Determined" could be considered archival material for display purposes,
  // or just show an empty state until real archive logic is added to context.
  const archives = useMemo(() => [], []); 

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchText.toLowerCase();
    let list = archives.filter((r: any) =>
      (r.municipality ?? "").toString().toLowerCase().includes(normalizedSearch)
    );
    return list;
  }, [archives, searchText]);

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 border-4 border-[#003087] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="bg-[#003087] text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Archive className="h-6 w-6 text-blue-200" />
              <h1 className="text-2xl font-black uppercase tracking-tight">Archive Center</h1>
            </div>
            <p className="text-blue-100 text-sm font-medium">Historical compliance records and data retention</p>
          </div>
        </div>

        <EmptyState 
          title="Archive Center is Empty" 
          message="Records archived from the monitoring dashboard will appear here for historical tracking."
        />
      </div>
    </div>
  );
}
