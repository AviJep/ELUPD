import { useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { useApiData } from "../contexts/ApiDataContext";

interface MunicipalityDirectoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function MunicipalityDirectoryModal({ open, onClose }: MunicipalityDirectoryModalProps) {
  const { municipalities } = useApiData();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const normalized = search.toLowerCase();
    return municipalities
      .filter((m) =>
        m.name.toLowerCase().includes(normalized) ||
        m.province.toLowerCase().includes(normalized)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [municipalities, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(1100px,96vw)] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">City / Municipality Directory</h2>
            <p className="text-sm text-gray-600">Browse and search municipalities shared across the system.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-4">
          <Input
            placeholder="Search by municipality or province..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <EmptyState
                title="No municipalities found"
                message="Use the system to add municipalities and they will appear here."
              />
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Municipality</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Province</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Last Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{m.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{m.province}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            m.status
                              ? ("bg-green-100 text-green-800" as string)
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {m.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {m.lastUpdate ? new Date(m.lastUpdate).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
