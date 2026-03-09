import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Filter, Download, X, Eye, Edit, Archive } from "lucide-react";

const initialComplianceData = [
  {
    id: 1,
    municipality: "Bacolod City",
    province: "Negros Occidental",
    barangays: 61,
    status: "updated",
    lastUpdate: "2026-03-02",
    percentage: 98,
    contactName: "John Doe",
    position: "City Mayor",
    email: "john.doe@bacolod.gov.ph",
    contactNumber: "(034) 123-4567",
    remarks: "All records submitted and verified.",
  },
  {
    id: 2,
    municipality: "Dumaguete City",
    province: "Negros Oriental",
    barangays: 30,
    status: "updated",
    lastUpdate: "2026-03-03",
    percentage: 96,
    contactName: "Jane Smith",
    position: "City Planning Officer",
    email: "jane.smith@dumaguete.gov.ph",
    contactNumber: "(035) 765-4321",
    remarks: "Awaiting final compliance report.",
  },
  {
    id: 3,
    municipality: "Silay City",
    province: "Negros Occidental",
    barangays: 16,
    status: "updated",
    lastUpdate: "2026-03-01",
    percentage: 94,
    contactName: "Ricardo Cruz",
    position: "City Treasurer",
    email: "ricardo.cruz@silay.gov.ph",
    contactNumber: "(034) 987-6543",
    remarks: "Minor updates pending review.",
  },
  {
    id: 4,
    municipality: "Cadiz City",
    province: "Negros Occidental",
    barangays: 23,
    status: "non-compliance",
    lastUpdate: "2026-01-15",
    percentage: 45,
    contactName: "Maria Lopez",
    position: "City Legal Counsel",
    email: "maria.lopez@cadiz.gov.ph",
    contactNumber: "(034) 555-0123",
    remarks: "Mayor's office awaiting further guidance.",
  },
  {
    id: 5,
    municipality: "Bayawan City",
    province: "Negros Oriental",
    barangays: 28,
    status: "non-compliance",
    lastUpdate: "2026-01-10",
    percentage: 52,
    contactName: "Allan Reyes",
    position: "Municipal Administrator",
    email: "allan.reyes@bayawan.gov.ph",
    contactNumber: "(035) 222-3344",
    remarks: "Pending submission of missing documents.",
  },
  {
    id: 6,
    municipality: "Talisay City",
    province: "Negros Occidental",
    barangays: 14,
    status: "updating",
    lastUpdate: "2026-02-28",
    percentage: 78,
    contactName: "Carlos Mendoza",
    position: "City Planning Officer",
    email: "carlos.mendoza@talisay.gov.ph",
    contactNumber: "(034) 333-4455",
    remarks: "Finalizing the compliance report.",
  },
  {
    id: 7,
    municipality: "Bago City",
    province: "Negros Occidental",
    barangays: 24,
    status: "updating",
    lastUpdate: "2026-02-25",
    percentage: 72,
    contactName: "Elena Rivera",
    position: "Municipal Health Officer",
    email: "elena.rivera@bagocity.gov.ph",
    contactNumber: "(034) 444-5566",
    remarks: "Mayor's office coordinating with barangay captains.",
  },
  {
    id: 8,
    municipality: "Kabankalan City",
    province: "Negros Occidental",
    barangays: 32,
    status: "expired",
    lastUpdate: "2025-11-20",
    percentage: 35,
    contactName: "Rafael Santos",
    position: "City Engineer",
    email: "rafael.santos@kabankalan.gov.ph",
    contactNumber: "(034) 555-6677",
    remarks: "Compliance data expired; resubmission required.",
  },
  {
    id: 9,
    municipality: "Maria",
    province: "Siquijor",
    barangays: 21,
    status: "non-compliance",
    lastUpdate: "2026-01-20",
    percentage: 48,
    contactName: "Teresa Gomez",
    position: "Municipal Health Officer",
    email: "teresa.gomez@maria.gov.ph",
    contactNumber: "(035) 888-9900",
    remarks: "Requesting extension for completed reports.",
  },
  {
    id: 10,
    municipality: "Siquijor",
    province: "Siquijor",
    barangays: 42,
    status: "updated",
    lastUpdate: "2026-03-01",
    percentage: 97,
    contactName: "Antonio Perez",
    position: "Municipal Administrator",
    email: "antonio.perez@siquijor.gov.ph",
    contactNumber: "(035) 777-1234",
    remarks: "All mayor's office clearances secured.",
  },
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
  // store compliance data in state and localStorage so map can read updated statuses
  const loadCompliance = () => {
    try {
      const stored = localStorage.getItem("complianceData");
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialComplianceData;
  };
  const [data, setData] = useState<typeof initialComplianceData>(loadCompliance());
  const [selectedItem, setSelectedItem] = useState<typeof initialComplianceData[0] | null>(null);
  const [editItem, setEditItem] = useState<typeof initialComplianceData[0] | null>(null);

  // action handlers
  const handleView = (item: typeof initialComplianceData[0]) => {
    setSelectedItem(item);
    setEditItem(null);
  };

  const handleEdit = (item: typeof initialComplianceData[0]) => {
    setSelectedItem(item);
    setEditItem(item);
  };

  // persist archives in localStorage under key 'archivedCompliance'
  const saveArchiveItem = (item: typeof initialComplianceData[0]) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("archivedCompliance") || "[]") || [];
      existing.push(item);
      localStorage.setItem("archivedCompliance", JSON.stringify(existing));
    } catch (e) {
      console.error("failed to save archive", e);
    }
  };

  const handleArchive = (item: typeof initialComplianceData[0]) => {
    setData((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      localStorage.setItem("complianceData", JSON.stringify(updated));
      window.dispatchEvent(new Event("complianceUpdate"));
      return updated;
    });
    saveArchiveItem(item);
    setSelectedItem(null);
    if (editItem?.id === item.id) {
      setEditItem(null);
    }
  };

  const filteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesProvince =
        provinceFilter === "all" ||
        item.province.toLowerCase().includes(provinceFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        item.municipality.toLowerCase().includes(searchText.toLowerCase());
      return matchesProvince && matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
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

    return filtered;
  }, [searchText, provinceFilter, statusFilter, sortKey, sortOrder, data]);

  const downloadCSV = (rows: typeof initialComplianceData) => {
    const header = [
      "Municipality",
      "Province",
      "Name",
      "Position",
      "Email",
      "Contact Number",
      "Remarks",
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
          r.contactName,
          r.position,
          r.email,
          r.contactNumber,
          r.remarks,
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
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Contact Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Remarks
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
                    onClick={() => handleView(item)}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {item.municipality}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.province}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.contactName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.position}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.contactNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.remarks}
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
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(item);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(item);
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details modal */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedItem(null)}
          />

          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-lg p-6 z-[1001]">
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
                const inEdit = editItem && editItem.id === selectedItem.id;
                const readOnly = key === "id";

                const rowClass = "flex items-center gap-2";
                const labelClass = "w-1/3 text-sm font-medium text-gray-700 capitalize";
                const inputClass = "w-2/3";

                if (key === "status") {
                  return (
                    <div key={key} className={rowClass}>
                      <span className={labelClass}>{key}</span>
                      <Select
                        value={inEdit ? editItem.status : selectedItem.status}
                        onValueChange={(v) => {
                          // update selectedItem for immediate feedback
                          if (selectedItem) {
                            setSelectedItem({ ...selectedItem, status: v });
                          }
                          if (!inEdit && selectedItem) {
                            // automatically enter edit mode when user interacts
                            setEditItem({ ...selectedItem, status: v });
                          } else if (inEdit && editItem) {
                            setEditItem({ ...editItem, status: v });
                          }
                        }}
                        className={inputClass}
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

                if (inEdit) {
                  if (key === "percentage") {
                    return (
                      <div key={key} className={rowClass}>
                        <span className={labelClass}>{key}</span>
                        <Input
                          type="number"
                          value={editItem.percentage}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              percentage: Number(e.target.value),
                            })
                          }
                          className={inputClass + " w-1/4"}
                        />
                      </div>
                    );
                  }

                  // generic editable field
                  return (
                    <div key={key} className={rowClass}>
                      <span className={labelClass}>
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <Input
                        value={(editItem as any)[key] as any}
                        onChange={(e) =>
                          setEditItem({ ...editItem, [key]: e.target.value })
                        }
                        disabled={readOnly}
                        className={inputClass}
                      />
                    </div>
                  );
                }

                // view mode
                return (
                  <div key={key} className={rowClass}>
                    <span className={labelClass}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-sm text-gray-900 w-2/3">{value as any}</span>
                  </div>
                );
              })}
              <div className="flex gap-2 mt-6">
                {editItem && editItem.id === selectedItem.id && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setData((prev) =>
                        prev.map((i) => (i.id === editItem.id ? editItem : i))
                      );
                      setSelectedItem(null);
                      setEditItem(null);
                    }}
                  >
                    Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to archive this entry?"
                      )
                    ) {
                      handleArchive(selectedItem);
                    }
                  }}
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(null);
                    setEditItem(null);
                  }}
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
