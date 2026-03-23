import { useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { useLgus } from "../LGUContext";
import { CLUPStatus } from "../types";

// Map the new schema status to the legacy status for map colors
const mapSchemaStatusToLegacy = (status: string | undefined): CLUPStatus => {
  switch (status) {
    case 'Review & Approval': return 'updated';
    case 'CLUP Formulation': return 'for-updating';
    case 'Prephase': return 'no-clup';
    case 'Not Determined': return 'expired';
    default: return 'no-clup';
  }
};

const statusConfig: Record<CLUPStatus, { label: string, color: string }> = {
  'updated': { label: 'Updated', color: 'bg-green-100 text-green-800' },
  'for-updating': { label: 'For Updating', color: 'bg-orange-100 text-orange-800' },
  'no-clup': { label: 'No CLUP', color: 'bg-red-100 text-red-800' },
  'expired': { label: 'Expired', color: 'bg-yellow-100 text-yellow-800' },
};

interface MunicipalityDirectoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function MunicipalityDirectoryModal({ open, onClose }: MunicipalityDirectoryModalProps) {
  const { lgus } = useLgus();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const normalized = search.toLowerCase();
    return lgus
      .filter((m) =>
        m.city_municipality.toLowerCase().includes(normalized) ||
        m.province.toLowerCase().includes(normalized)
      )
      .sort((a, b) => a.city_municipality.localeCompare(b.city_municipality));
  }, [lgus, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-[#003087] uppercase tracking-tight">Regional Directory</h2>
            <p className="text-sm text-gray-500 font-medium">Complete list of cities and municipalities in NIR</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="px-8 py-6">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Filter by city, municipality or province..."
              className="pl-12 h-14 bg-gray-50 border-none text-lg rounded-xl focus:ring-2 focus:ring-[#003087]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No results found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any municipality matching "{search}"</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 px-4">City / Municipality</th>
                    <th className="pb-4 px-4">Province</th>
                    <th className="pb-4 px-4">Income Class</th>
                    <th className="pb-4 px-4">CLUP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((m) => {
                    const legacyStatus = mapSchemaStatusToLegacy(m.clup_progress?.clup_status);
                    const config = statusConfig[legacyStatus];
                    return (
                      <tr key={m.id} className="group hover:bg-blue-50/50 transition-colors">
                        <td className="py-5 px-4">
                          <span className="text-sm font-black text-gray-800 block group-hover:text-[#003087] transition-colors">{m.city_municipality}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{m.lgu_type}</span>
                        </td>
                        <td className="py-5 px-4">
                          <span className="text-sm font-medium text-gray-600">{m.province}</span>
                        </td>
                        <td className="py-5 px-4">
                          <Badge variant="outline" className="text-[10px] font-bold border-gray-200 text-gray-500">
                            {m.income_class}
                          </Badge>
                        </td>
                        <td className="py-5 px-4">
                          <Badge className={`text-[10px] font-black border-none shadow-sm ${config.color}`}>
                            {config.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Search } from "lucide-react";
