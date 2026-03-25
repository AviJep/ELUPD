import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, RotateCcw, Trash2, Archive } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { EmptyState } from "../components/EmptyState";
import { useLgus } from "../LGUContext";
import { PageShell } from "../components/PageShell";

export function ArchiveCenter() {
  const { isLoading, archivedLgus, restoreLgu, permanentlyDeleteLgu } = useLgus();
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name">("recent");

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchText.toLowerCase();
    let list = archivedLgus.filter((record) => {
      const matchesSearch = `${record.city_municipality} ${record.province}`.toLowerCase().includes(normalizedSearch);
      const matchesProvince = provinceFilter === "all" || record.province === provinceFilter;
      return matchesSearch && matchesProvince;
    });

    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.city_municipality.localeCompare(b.city_municipality));
    } else if (sortBy === "oldest") {
      list = [...list].sort((a, b) => new Date(a.archivedAt).getTime() - new Date(b.archivedAt).getTime());
    } else {
      list = [...list].sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime());
    }

    return list;
  }, [archivedLgus, provinceFilter, searchText, sortBy]);

  const provinceOptions = useMemo(
    () => Array.from(new Set(archivedLgus.map((record) => record.province))).sort((a, b) => a.localeCompare(b)),
    [archivedLgus],
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-4 border-[#003087] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageShell
      title="Archive Center"
      subtitle="Manage archived LGU records with restore and permanent deletion"
      maxWidthClass="max-w-[1400px]"
    >
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search archived records..."
                className="pl-9"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>

            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinceOptions.map((province) => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "recent" | "oldest" | "name")}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="No Archived Records"
          message="Archived LGU records will appear here once archive actions are performed from the tables."
        />
      ) : (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Archive className="h-4 w-4" />
              Archived LGUs
              <Badge variant="outline">{filteredRecords.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{record.city_municipality}</p>
                    <p className="text-sm text-gray-600">{record.province}</p>
                    <p className="text-xs text-gray-500 mt-1">Archived: {new Date(record.archivedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        void restoreLgu(record.id);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm(`Permanently delete ${record.city_municipality}? This cannot be undone.`)) {
                          void permanentlyDeleteLgu(record.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
