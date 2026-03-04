import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Filter, Download } from "lucide-react";

const complianceData = [
  { id: 1, municipality: "Bacolod City", province: "Negros Occidental", barangays: 61, status: "updated", lastUpdate: "2026-03-02", percentage: 98 },
  { id: 2, municipality: "Dumaguete City", province: "Negros Oriental", barangays: 30, status: "updated", lastUpdate: "2026-03-03", percentage: 96 },
  { id: 3, municipality: "Silay City", province: "Negros Occidental", barangays: 16, status: "updated", lastUpdate: "2026-03-01", percentage: 94 },
  { id: 4, municipality: "Cadiz City", province: "Negros Occidental", barangays: 23, status: "non-compliance", lastUpdate: "2026-01-15", percentage: 45 },
  { id: 5, municipality: "Bayawan City", province: "Negros Oriental", barangays: 28, status: "non-compliance", lastUpdate: "2026-01-10", percentage: 52 },
  { id: 6, municipality: "Talisay City", province: "Negros Occidental", barangays: 14, status: "updating", lastUpdate: "2026-02-28", percentage: 78 },
  { id: 7, municipality: "Bago City", province: "Negros Occidental", barangays: 24, status: "updating", lastUpdate: "2026-02-25", percentage: 72 },
  { id: 8, municipality: "Kabankalan City", province: "Negros Occidental", barangays: 32, status: "expired", lastUpdate: "2025-11-20", percentage: 35 },
  { id: 9, municipality: "Maria", province: "Siquijor", barangays: 21, status: "non-compliance", lastUpdate: "2026-01-20", percentage: 48 },
  { id: 10, municipality: "Siquijor", province: "Siquijor", barangays: 42, status: "updated", lastUpdate: "2026-03-01", percentage: 97 },
];

const statusConfig = {
  updated: { label: "Updated", color: "bg-green-100 text-green-800 border-green-300" },
  updating: { label: "Updating", color: "bg-orange-100 text-orange-800 border-orange-300" },
  "non-compliance": { label: "Non-Compliant", color: "bg-red-100 text-red-800 border-red-300" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800 border-gray-300" },
};

export function ComplianceMonitoring() {
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"municipality" | "province" | "percentage" | "lastUpdate">("municipality");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItem, setSelectedItem] = useState<typeof complianceData[0] | null>(null);

  const filteredData = useMemo(() => {
    let data = complianceData.filter((item) => {
      const matchesProvince =
        provinceFilter === "all" ||
        item.province.toLowerCase().includes(provinceFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        item.municipality.toLowerCase().includes(searchText.toLowerCase());
      return matchesProvince && matchesStatus && matchesSearch;
    });

    data.sort((a, b) => {
      let aVal: any = a[sortKey as any];
      let bVal: any = b[sortKey as any];
      if (sortKey === "percentage") {
        aVal = a.percentage;
        bVal = b.percentage;
      }
      if (sortKey === "lastUpdate") {
        aVal = new Date(a.lastUpdate).getTime();
        bVal = new Date(b.lastUpdate).getTime();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchText, provinceFilter, statusFilter, sortKey, sortOrder]);

  const downloadCSV = (rows: typeof complianceData) => {
    const header = [
      "Municipality",
      "Province",
      "Barangays",
      "Status",
      "Compliance %",
      "Last Update",
    ];
    const csv = [header.join(",")];

    rows.forEach((r) => {
      csv.push(
        [
          r.municipality,
          r.province,
          r.barangays,
          r.status,
          r.percentage,
          r.lastUpdate,
        ].join(",")
      );
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compliance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Compliance Monitoring
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Track and monitor compliance status across all regions
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search municipality..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select
              value={provinceFilter}
              onValueChange={(v) => setProvinceFilter(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                <SelectItem value="Negros Occidental">
                  Negros Occidental
                </SelectItem>
                <SelectItem value="Negros Oriental">
                  Negros Oriental
                </SelectItem>
                <SelectItem value="Siquijor">Siquijor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="updating">Updating</SelectItem>
                <SelectItem value="non-compliance">Non-Compliant</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              onClick={() => downloadCSV(filteredData)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Compliance Status Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSortKey("municipality");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Municipality
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSortKey("province");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Province
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Barangays
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSortKey("percentage");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Compliance %
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSortKey("lastUpdate");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Last Update
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {item.municipality}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.province}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.barangays}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          statusConfig[
                            item.status as keyof typeof statusConfig
                          ].color
                        }
                      >
                        {
                          statusConfig[
                            item.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              item.percentage >= 90
                                ? "bg-green-600"
                                : item.percentage >= 70
                                ? "bg-orange-600"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 min-w-[40px]">
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.lastUpdate}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 p-0"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details drawer/modal */}
      {selectedItem && (
        <div>
          <div
            className="fixed inset-0 bg-black/30 z-[1000]"
            onClick={() => setSelectedItem(null)}
          />
          <div className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-[1001] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedItem).map(([key, value]) => {
                if (key === "status") {
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                      <Select
                        value={selectedItem.status}
                        onValueChange={(v) =>
                          setSelectedItem({ ...selectedItem, status: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="updated">Updated</SelectItem>
                          <SelectItem value="updating">Updating</SelectItem>
                          <SelectItem value="non-compliance">
                            Non-Compliant
                          </SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                if (key === "percentage") {
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                      <Input
                        type="number"
                        value={selectedItem.percentage}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            percentage: Number(e.target.value),
                          })
                        }
                        className="w-20"
                      />
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-sm text-gray-900">{value as any}</span>
                  </div>
                );
              })}
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    // save changes back into data array
                    const idx = complianceData.findIndex(
                      (i) => i.id === selectedItem.id
                    );
                    if (idx !== -1) {
                      complianceData[idx] = selectedItem;
                    }
                    setSelectedItem(null);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Mock archive action - remove item
                    const index = complianceData.findIndex(
                      (i) => i.id === selectedItem.id
                    );
                    if (index !== -1) {
                      complianceData.splice(index, 1);
                      setSelectedItem(null);
                    }
                  }}
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-red-50 border-red-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-700">3</div>
            <div className="text-sm text-red-600 mt-1">Critical Non-Compliance</div>
            <div className="text-xs text-red-500 mt-2">Requires immediate action</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-700">12</div>
            <div className="text-sm text-orange-600 mt-1">Pending Updates</div>
            <div className="text-xs text-orange-500 mt-2">In progress</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-700">2</div>
            <div className="text-sm text-gray-600 mt-1">Expired Records</div>
            <div className="text-xs text-gray-500 mt-2">Needs renewal</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
