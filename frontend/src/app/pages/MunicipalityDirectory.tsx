import { useMemo, useState } from "react";
import { useApiData } from "../contexts/ApiDataContext";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { EmptyState } from "../components/EmptyState";

export function MunicipalityDirectory() {
  const { municipalities, isLoading } = useApiData();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return municipalities;
    return municipalities.filter((m) =>
      m.name.toLowerCase().includes(term) ||
      m.province.toLowerCase().includes(term)
    );
  }, [municipalities, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Municipal / City Directory</h1>
          <p className="mt-1 text-sm text-gray-600">
            This is a shared data view for the system&apos;s municipality list.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <Input
            placeholder="Search municipalities or provinces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Loading directory...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No municipalities found"
          message="The directory will populate once data is available." 
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Municipality</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Province</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.province}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant="outline"
                      className={
                        m.status
                          ? ("bg-green-100 text-green-800" as string)
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {m.status ?? "Unknown"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
