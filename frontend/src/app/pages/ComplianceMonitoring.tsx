import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/EmptyState";
import { Search, Download, Eye, Edit, Archive } from "lucide-react";
import * as XLSX from "xlsx";
import { useApiData } from "../contexts/ApiDataContext";

const statusConfig = {
  updated: { label: "Updated", color: "bg-green-100 text-green-800 border-green-300" },
  updating: { label: "For Updating", color: "bg-orange-100 text-orange-800 border-orange-300" },
  "non-compliance": { label: "Non-Compliant", color: "bg-red-100 text-red-800 border-red-300" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800 border-gray-300" },
};

export function ComplianceMonitoring() {
  const {
    isLoading,
    complianceRecords,
    refresh,
    updateComplianceRecord,
    archiveComplianceRecord,
    addComplianceRecords,
    resetData,
  } = useApiData();

  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"municipality" | "province" | "percentage" | "lastUpdate">("municipality");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const statusOptions = useMemo(() => {
    const options = new Set<string>(Object.keys(statusConfig));
    complianceRecords.forEach((record) => {
      if (record.status) {
        options.add(record.status.toString());
      }
    });
    return Array.from(options);
  }, [complianceRecords]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchText.toLowerCase();

    return complianceRecords
      .filter((item) => {
        const municipality = (item.municipality ?? "").toString();
        const province = (item.province ?? "").toString();
        const status = (item.status ?? "").toString();

        const matchesProvince =
          provinceFilter === "all" ||
          province.toLowerCase().includes(provinceFilter.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || status === statusFilter;
        const matchesSearch = municipality.toLowerCase().includes(normalizedSearch);

        return matchesProvince && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let aVal: any = a[sortKey as any];
        let bVal: any = b[sortKey as any];

        if (sortKey === "percentage") {
          aVal = a.percentage ?? 0;
          bVal = b.percentage ?? 0;
        }
        if (sortKey === "lastUpdate") {
          aVal = new Date(a.lastUpdate ?? 0).getTime();
          bVal = new Date(b.lastUpdate ?? 0).getTime();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [searchText, provinceFilter, statusFilter, sortKey, sortOrder, complianceRecords]);

  const hasFilteredData = filteredData.length > 0;

  const handleOpenView = (item: any) => {
    setSelectedItem(item);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsAdding(false);
  };

  const provinceOptions = [
    "Negros Occidental",
    "Negros Oriental",
    "Siquijor",
  ];

  const municipalityOptions: Record<string, string[]> = {
    "Negros Occidental": [
      "City of Bacolod",
      "City of Bago",
      "City of Cadiz",
      // add more if desired
    ],
    "Negros Oriental": [
      "Dumaguete City",
      "Bayawan City",
      "Tanjay City",
      // add more if desired
    ],
    Siquijor: [
      "Municipality of Siquijor",
      "Municipality of Larena",
      "Municipality of Enrique Villanueva",
      // add more if desired
    ],
  };

  const handleAddNew = () => {
    setSelectedItem({
      province: "Negros Occidental",
      municipality: municipalityOptions["Negros Occidental"]?.[0] ?? "",
      planStartYear: undefined,
      planEndYear: undefined,
      resolutionNumber: "",
      approvalDate: "",
      status: "",
      hardCopyAvailable: false,
      softCopyUrl: "",
    });
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleSave = async (updated: any) => {
    if (isAdding) {
      await addComplianceRecords([updated]);
    } else {
      await updateComplianceRecord(updated);
    }
    await refresh();
    setSelectedItem(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleArchive = (item: any) => {
    setSelectedItem(item);
    setConfirmArchive(true);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(filteredData.map((r) => r.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const confirmArchiveRecord = async () => {
    if (selectedItem) {
      await archiveComplianceRecord(selectedItem.id);
      await refresh();
    }
    setConfirmArchive(false);
    setSelectedItem(null);
  };

  const handleResetData = async () => {
    if (
      !window.confirm(
        "This will clear all compliance data (including archived items) from the app and database. Continue?"
      )
    ) {
      return;
    }

    await resetData();
    setSelectedIds([]);
  };

  const normalizeHeader = (header: string) =>
    header
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const getCellValue = (row: Record<string, any>, ...possibleKeys: string[]) => {
    for (const key of possibleKeys) {
      const normalizedKey = normalizeHeader(key);
      const foundKey = Object.keys(row).find(
        (k) => normalizeHeader(k) === normalizedKey
      );
      if (foundKey) {
        return row[foundKey];
      }
    }
    return undefined;
  };

  const normalizeString = (value: unknown) =>
    value?.toString().trim().toLowerCase() ?? "";

  const handleImportClick = () => {
    setImportError(null);
    setImportNotice(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportNotice(null);

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (!rows.length) {
        setImportError("The selected file contains no rows.");
        return;
      }

      const getKey = (province: string, municipality: string) =>
        `${normalizeString(province)}|${normalizeString(municipality)}`;

      const existingMap = new Map<string, any>();
      complianceRecords.forEach((r) => {
        const key = getKey(r.province ?? "", r.municipality ?? "");
        existingMap.set(key, r);
      });

      let added = 0;
      let updated = 0;
      const toAdd: any[] = [];

      for (const row of rows) {
        const hardCopyValue = getCellValue(row, "Hard Copy", "Hard Copy Available");

        const record = {
          province: getCellValue(row, "Province") ?? "",
          municipality:
            getCellValue(row, "City / Municipality", "Municipality") ?? "",
          planStartYear: Number(
            getCellValue(row, "Plan Start", "Plan Start Year") ?? ""
          ) || undefined,
          planEndYear: Number(
            getCellValue(row, "Plan End", "Plan End Year") ?? ""
          ) || undefined,
          resolutionNumber:
            getCellValue(row, "Resolution No.", "Resolution Number") ?? "",
          approvalDate: getCellValue(row, "Approval Date") ?? "",
          status: getCellValue(row, "CLUP Status", "Status") ?? "",
          hardCopyAvailable:
            typeof hardCopyValue === "string"
              ? hardCopyValue.toLowerCase().startsWith("y")
              : Boolean(hardCopyValue),
          softCopyUrl:
            getCellValue(row, "Soft Copy (PDF)", "Soft Copy", "Soft Copy URL") ?? "",
        };

        const key = getKey(record.province, record.municipality);
        const existing = existingMap.get(key);
        if (existing) {
          const saved = await updateComplianceRecord({ ...existing, ...record, id: existing.id });
          if (saved) {
            updated++;
          }
        } else {
          toAdd.push(record);
        }
      }

      if (toAdd.length) {
        const created = await addComplianceRecords(toAdd);
        added = created.length;
      }

      await refresh();

      setImportNotice(
        `Imported ${added} new record${added === 1 ? "" : "s"} and updated ${updated} existing record${
          updated === 1 ? "" : "s"
        }.`
      );
    } catch (error) {
      console.error(error);
      setImportError("Unable to import file. Make sure it is a valid Excel file.");
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const downloadCSV = (rows: any[]) => {
    const header = [
      "Province",
      "Municipality",
      "Plan Start",
      "Plan End",
      "Resolution Number",
      "Approval Date",
      "CLUP Status",
      "Hard Copy Available",
      "Soft Copy (PDF)",
    ];
    const csv = [header.join(",")];

    rows.forEach((r) => {
      csv.push(
        [
          r.province ?? "",
          r.municipality ?? "",
          r.planStartYear ?? "",
          r.planEndYear ?? "",
          r.resolutionNumber ?? "",
          r.approvalDate ?? "",
          r.status ?? "",
          r.hardCopyAvailable ? "Yes" : "No",
          r.softCopyUrl ?? "",
        ].join(",")
      );
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clup-directory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const row1 = [
      "",
      "Province",
      "City/Municipality",
      "Planning Period of the Latest Plan",
      "",
      "Resolution Number of the Latest Plan",
      "Approval Date",
      "CLUP Status",
      "Hard Copy Availability",
      "Soft Copy Availability",
    ];

    const row2 = [
      "",
      "",
      "",
      "Start Year",
      "End Year",
      "",
      "",
      "",
      "",
      "",
    ];

    const csv = [row1.join(","), row2.join(",")];
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clup-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="Loading CLUP / PDPFPD directory..."
          message="Fetching records from the database."
        />
      </div>
    );
  }


  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            CLUP / PDPFPD Monitoring
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and monitor CLUP/PDPFPD records across all municipalities and cities.
          </p>
        </div>
      </div>

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
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusConfig[status]?.label ?? status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => downloadCSV(filteredData)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={downloadTemplate}>
                  <span className="mr-2">📄</span>
                  Download Template
                </Button>
                <Button className="flex-1" onClick={handleImportClick}>
                  <span className="mr-2">📄</span>
                  Import Excel
                </Button>
                <Button className="flex-1" onClick={handleAddNew}>
                  <span className="mr-2">➕</span>
                  Add Record
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant={selectedIds.length ? "destructive" : "secondary"}
                  disabled={!selectedIds.length}
                  onClick={async () => {
                    if (!selectedIds.length) return;
                    if (!window.confirm("Archive selected records?")) return;
                    await Promise.all(
                      selectedIds.map((id) => archiveComplianceRecord(id))
                    );
                    await refresh();
                    clearSelection();
                  }}
                >
                  <span className="mr-2">🗑️</span>
                  Archive Selected
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={handleResetData}
                >
                  <span className="mr-2">♻️</span>
                  Reset Data
                </Button>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              {importError && (
                <p className="text-sm text-red-600">{importError}</p>
              )}
              {importNotice && (
                <p className="text-sm text-green-600">{importNotice}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            CLUP / PDPFPD Status Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={
                        filteredData.length > 0 &&
                        selectedIds.length === filteredData.length
                      }
                      onChange={(e) =>
                        e.target.checked ? selectAll() : clearSelection()
                      }
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Province</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">City / Municipality</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan Start</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan End</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resolution No.</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Approval Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CLUP Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hard Copy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Soft Copy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.province}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.municipality}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.planStartYear ?? ""}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.planEndYear ?? ""}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.resolutionNumber ?? ""}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.approvalDate ?? ""}</td>
                    <td className="py-3 px-4">
                      {(() => {
                        const statusKey = (item.status ?? "").toString().toLowerCase();
                        const status = statusConfig[statusKey as keyof typeof statusConfig];
                        return (
                          <Badge
                            variant="outline"
                            className={
                              status?.color ?? "bg-gray-100 text-gray-700 border-gray-200"
                            }
                          >
                            {status?.label ?? item.status ?? "Unknown"}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.hardCopyAvailable ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4 text-sm text-blue-600">
                      {item.softCopyUrl ? (
                        <a href={item.softCopyUrl} target="_blank" rel="noreferrer">
                          View PDF
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenView(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchive(item)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      No matching records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setSelectedItem(null);
              setIsEditing(false);
            }}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-lg p-6 z-[1001]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isAdding ? "Add Record" : isEditing ? "Edit Record" : "View Record"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedItem(null);
                  setIsEditing(false);
                }}
              >
                ✕
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Province</p>
                  {isEditing ? (
                    <Select
                      value={selectedItem.province ?? ""}
                      onValueChange={(value) => {
                        const nextMunicipalities = municipalityOptions[value] ?? [];
                        setSelectedItem({
                          ...selectedItem,
                          province: value,
                          municipality: nextMunicipalities[0] ?? "",
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provinceOptions.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.province}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Municipality</p>
                  {isEditing ? (
                    <Select
                      value={selectedItem.municipality ?? ""}
                      onValueChange={(value) =>
                        setSelectedItem({ ...selectedItem, municipality: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(municipalityOptions[selectedItem.province ?? ""] ?? []).map(
                          (mun) => (
                            <SelectItem key={mun} value={mun}>
                              {mun}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.municipality}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Plan Start</p>
                  {isEditing ? (
                    <Input
                      value={selectedItem.planStartYear ?? ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          planStartYear: Number(e.target.value),
                        })
                      }
                      type="number"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.planStartYear}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Plan End</p>
                  {isEditing ? (
                    <Input
                      value={selectedItem.planEndYear ?? ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          planEndYear: Number(e.target.value),
                        })
                      }
                      type="number"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.planEndYear}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Resolution No.</p>
                  {isEditing ? (
                    <Input
                      value={selectedItem.resolutionNumber ?? ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          resolutionNumber: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.resolutionNumber}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Approval Date</p>
                  {isEditing ? (
                    <Input
                      value={selectedItem.approvalDate ?? ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          approvalDate: e.target.value,
                        })
                      }
                      type="date"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.approvalDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">CLUP Status</p>
                  {isEditing ? (
                    <Select
                      value={selectedItem.status ?? ""}
                      onValueChange={(v) =>
                        setSelectedItem({ ...selectedItem, status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusConfig[status]?.label ?? status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-900">{selectedItem.status}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(null);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSave(selectedItem)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmArchive && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setConfirmArchive(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 z-[1001]">
            <h2 className="text-lg font-semibold">Archive Record?</h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to archive this record? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setConfirmArchive(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmArchiveRecord}
              >
                Yes, Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
