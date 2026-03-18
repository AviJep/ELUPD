import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Archive, ArrowUpDown, Download, Eye, Filter, Pencil, Plus, RotateCcw, Search, Upload, X } from "lucide-react";
import { clupToCompliance, complianceToClup, useData } from "../DataContext";
import type { CLUPStatus, Municipality } from "../types";

interface ComplianceRecord {
  id: number;
  municipalityId: string;
  municipality: string;
  province: string;
  barangays: number;
  status: "updated" | "updating" | "non-compliance" | "expired";
  lastUpdate: string;
  percentage: number;
  archived: boolean;
}

type ComplianceForm = {
  municipality: string;
  province: string;
  barangays: number;
  status: ComplianceRecord["status"];
  lastUpdate: string;
};

type SortKey = "municipality" | "province" | "barangays" | "status" | "percentage" | "lastUpdate";

const STATUS_OPTIONS = ["updated", "updating", "non-compliance", "expired"] as const;
const PROVINCES = ["Negros Occidental", "Negros Oriental", "Siquijor"];

const statusConfig: Record<ComplianceRecord["status"], { label: string; color: string }> = {
  updated: { label: "Updated", color: "bg-green-100 text-green-800 border-green-300" },
  updating: { label: "Updating", color: "bg-orange-100 text-orange-800 border-orange-300" },
  "non-compliance": { label: "Non-Compliant", color: "bg-red-100 text-red-800 border-red-300" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800 border-gray-300" },
};

const BARANGAY_LOOKUP: Record<string, number> = {
  "Bacolod City": 61, "Bago City": 24, "Cadiz City": 22, "Escalante City": 21,
  "Himamaylan City": 28, "Kabankalan City": 28, "La Carlota City": 12,
  "Sagay City": 26, "San Carlos City": 18, "Silay City": 16, "Sipalay City": 17,
  "Talisay City": 16, "Victorias City": 23, "Binalbagan": 27, "Calatrava": 32,
  "Candoni": 12, "Cauayan": 14, "Enrique B. Magalona": 15, "Hinigaran": 23,
  "Hinoba-an": 15, "Ilog": 16, "Isabela": 31, "La Castellana": 10,
  "Manapla": 15, "Moises Padilla": 15, "Murcia": 16, "Pontevedra": 22,
  "Pulupandan": 11, "Salvador Benedicto": 8, "San Enrique": 6, "Toboso": 15,
  "Valladolid": 14, "Dumaguete City": 30, "Bayawan City": 28, "Bais City": 35,
  "Canlaon City": 12, "Guihulngan City": 38, "Tanjay City": 26, "Amlan": 14,
  "Ayungon": 30, "Bacong": 15, "Basay": 11, "Bindoy": 19, "Dauin": 18,
  "Jimalalud": 20, "La Libertad": 16, "Mabinay": 22, "Manjuyod": 20,
  "Pamplona": 15, "San Jose": 8, "Santa Catalina": 21, "Siaton": 24,
  "Sibulan": 13, "Tayasan": 26, "Valencia": 11, "Vallehermoso": 19,
  "Zamboanguita": 11, "Enrique Villanueva": 10, "Larena": 12, "Lazi": 14,
  "Maria": 12, "San Juan": 12, "Siquijor": 19,
};

function percentageForStatus(status: CLUPStatus): number {
  switch (status) {
    case "updated":
      return 95;
    case "for-updating":
      return 65;
    case "no-clup":
      return 15;
    case "expired":
      return 30;
  }
}

function makeEmptyForm(): ComplianceForm {
  return {
    municipality: "",
    province: PROVINCES[0],
    barangays: 0,
    status: "updated",
    lastUpdate: new Date().toISOString().slice(0, 10),
  };
}

function toRecord(municipality: Municipality, index: number, archivedIds: Set<string>): ComplianceRecord {
  return {
    id: index + 1,
    municipalityId: municipality.id,
    municipality: municipality.name,
    province: municipality.province,
    barangays: BARANGAY_LOOKUP[municipality.name] ?? 20,
    status: clupToCompliance[municipality.clupStatus],
    lastUpdate: municipality.lastUpdate,
    percentage: percentageForStatus(municipality.clupStatus),
    archived: archivedIds.has(municipality.id),
  };
}

export function ComplianceMonitoring() {
  const { municipalities, updateMunicipality, addMunicipality, addLog } = useData();

  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("municipality");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewItem, setViewItem] = useState<ComplianceRecord | null>(null);
  const [editItem, setEditItem] = useState<ComplianceRecord | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<ComplianceRecord | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<ComplianceForm>(makeEmptyForm());

  const data = useMemo(
    () => municipalities.map((municipality, index) => toRecord(municipality, index, archivedIds)),
    [municipalities, archivedIds],
  );

  const filtered = useMemo(() => {
    let list = data.filter((record) => (showArchived ? record.archived : !record.archived));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (record) =>
          record.municipality.toLowerCase().includes(query) ||
          record.province.toLowerCase().includes(query),
      );
    }

    if (filterProvince !== "all") {
      list = list.filter((record) => record.province === filterProvince);
    }

    if (filterStatus !== "all") {
      list = list.filter((record) => record.status === filterStatus);
    }

    return [...list].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return sortAsc ? leftValue - rightValue : rightValue - leftValue;
      }

      return sortAsc
        ? String(leftValue).localeCompare(String(rightValue))
        : String(rightValue).localeCompare(String(leftValue));
    });
  }, [data, filterProvince, filterStatus, searchQuery, showArchived, sortAsc, sortKey]);

  const liveData = data.filter((record) => !record.archived);
  const statNonCompliance = liveData.filter((record) => record.status === "non-compliance").length;
  const statUpdating = liveData.filter((record) => record.status === "updating").length;
  const statExpired = liveData.filter((record) => record.status === "expired").length;

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((current) => !current);
      return;
    }

    setSortKey(key);
    setSortAsc(true);
  }

  function resetFilters() {
    setSearchQuery("");
    setFilterProvince("all");
    setFilterStatus("all");
  }

  function openAdd() {
    setForm(makeEmptyForm());
    setAddOpen(true);
  }

  function openEdit(item: ComplianceRecord) {
    setForm({
      municipality: item.municipality,
      province: item.province,
      barangays: item.barangays,
      status: item.status,
      lastUpdate: item.lastUpdate,
    });
    setEditItem(item);
  }

  function saveAdd() {
    const trimmedMunicipality = form.municipality.trim();
    if (!trimmedMunicipality) {
      return;
    }

    addMunicipality({
      id: `custom-${Date.now()}`,
      name: trimmedMunicipality,
      province: form.province,
      clupStatus: complianceToClup[form.status],
      yearApproved: null,
      endYear: null,
      riskInformed: false,
      integratedShelterPlan: false,
      lastUpdate: form.lastUpdate,
    });

    BARANGAY_LOOKUP[trimmedMunicipality] = form.barangays;

    addLog({
      user: "admin@dhsud.gov.ph",
      action: "Add Municipality",
      module: "Compliance Monitoring",
      status: "success",
      details: `Added new municipality: ${trimmedMunicipality}`,
    });

    setAddOpen(false);
  }

  function saveEdit() {
    if (!editItem) {
      return;
    }

    const trimmedMunicipality = form.municipality.trim();
    if (!trimmedMunicipality) {
      return;
    }

    updateMunicipality(editItem.municipalityId, {
      name: trimmedMunicipality,
      province: form.province,
      clupStatus: complianceToClup[form.status],
      lastUpdate: form.lastUpdate,
    });

    BARANGAY_LOOKUP[trimmedMunicipality] = form.barangays;

    addLog({
      user: "admin@dhsud.gov.ph",
      action: "Status Update",
      module: "Compliance Monitoring",
      status: "success",
      details: `Updated ${trimmedMunicipality} status to ${statusConfig[form.status].label}`,
    });

    setEditItem(null);
  }

  function confirmArchive() {
    if (!archiveConfirm) {
      return;
    }

    setArchivedIds((current) => {
      const next = new Set(current);
      if (archiveConfirm.archived) {
        next.delete(archiveConfirm.municipalityId);
      } else {
        next.add(archiveConfirm.municipalityId);
      }
      return next;
    });

    addLog({
      user: "admin@dhsud.gov.ph",
      action: archiveConfirm.archived ? "Record Restored" : "Record Archive",
      module: "Compliance Monitoring",
      status: "success",
      details: `${archiveConfirm.archived ? "Restored" : "Archived"} ${archiveConfirm.municipality}`,
    });

    setArchiveConfirm(null);
  }

  function handleExport() {
    const header = "Municipality,Province,Barangays,Status,Compliance %,Last Update\n";
    const rows = filtered
      .map(
        (record) =>
          `"${record.municipality}","${record.province}",${record.barangays},"${statusConfig[record.status].label}",${record.percentage},"${record.lastUpdate}"`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "compliance_report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) {
          return;
        }

        const rows = text.split("\n").filter((line) => line.trim()).slice(1);
        const statusLabelToClup: Record<string, CLUPStatus> = {
          Updated: "updated",
          Updating: "for-updating",
          "Non-Compliant": "no-clup",
          Expired: "expired",
        };

        let count = 0;

        for (const row of rows) {
          const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!columns || columns.length < 6) {
            continue;
          }

          const strip = (value: string) => value.replace(/^"|"$/g, "").trim();
          const municipality = strip(columns[0]);
          const province = strip(columns[1]);
          const barangays = Number.parseInt(strip(columns[2]), 10);
          const statusLabel = strip(columns[3]);
          const lastUpdate = strip(columns[5]);
          const clupStatus = statusLabelToClup[statusLabel];

          if (!municipality || !province || !clupStatus) {
            continue;
          }

          const existing = municipalities.find((item) => item.name === municipality);
          if (existing) {
            updateMunicipality(existing.id, { province, clupStatus, lastUpdate });
          } else {
            addMunicipality({
              id: `imported-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              name: municipality,
              province,
              clupStatus,
              yearApproved: null,
              endYear: null,
              riskInformed: false,
              integratedShelterPlan: false,
              lastUpdate,
            });
          }

          if (!Number.isNaN(barangays)) {
            BARANGAY_LOOKUP[municipality] = barangays;
          }

          count++;
        }

        if (count > 0) {
          addLog({
            user: "admin@dhsud.gov.ph",
            action: "Data Import",
            module: "Compliance Monitoring",
            status: "success",
            details: `Imported and updated ${count} records from CSV`,
          });
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <th
        className="cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:text-blue-700"
        onClick={() => handleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <ArrowUpDown className="h-3 w-3 opacity-50" />
          {sortKey === field && <span className="text-xs text-blue-600">{sortAsc ? "▲" : "▼"}</span>}
        </span>
      </th>
    );
  }

  function FormFields() {
    const derivedPercentage = percentageForStatus(complianceToClup[form.status]);

    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Municipality</Label>
          <Input
            className="col-span-3"
            value={form.municipality}
            onChange={(event) => setForm({ ...form, municipality: event.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Province</Label>
          <select
            className="col-span-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={form.province}
            onChange={(event) => setForm({ ...form, province: event.target.value })}
          >
            {PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Barangays</Label>
          <Input
            type="number"
            className="col-span-3"
            min={0}
            value={form.barangays}
            onChange={(event) => setForm({ ...form, barangays: Number(event.target.value) })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Status</Label>
          <select
            className="col-span-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as ComplianceRecord["status"] })
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Compliance %</Label>
          <Input type="number" className="col-span-3" value={derivedPercentage} readOnly />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm">Last Update</Label>
          <Input
            type="date"
            className="col-span-3"
            value={form.lastUpdate}
            onChange={(event) => setForm({ ...form, lastUpdate: event.target.value })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#003087] text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold md:text-2xl">Compliance Monitoring</h1>
                <p className="text-sm font-semibold text-blue-200 md:text-base">
                  Track and monitor compliance status across all regions
                </p>
              </div>
            </div>
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-yellow-300">As of March 18, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <Card className="mb-6 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search municipality..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={filterProvince} onValueChange={setFilterProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" variant="outline" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Compliance Status Table
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({filtered.length} record{filtered.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={showArchived ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowArchived((current) => !current)}
              >
                <Archive className="mr-1 h-4 w-4" />
                {showArchived ? "Show Active" : "View Archived"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm" onClick={openAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <SortHeader label="Municipality" field="municipality" />
                    <SortHeader label="Province" field="province" />
                    <SortHeader label="Barangays" field="barangays" />
                    <SortHeader label="Status" field="status" />
                    <SortHeader label="Compliance %" field="percentage" />
                    <SortHeader label="Last Update" field="lastUpdate" />
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                        No records found.
                      </td>
                    </tr>
                  )}
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.municipality}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.province}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.barangays}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statusConfig[item.status].color}>
                          {statusConfig[item.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 max-w-[100px] flex-1 rounded-full bg-gray-200">
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
                          <span className="min-w-[40px] text-sm text-gray-700">{item.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.lastUpdate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                            title="View"
                            onClick={() => setViewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                            title="Edit"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              item.archived
                                ? "text-green-600 hover:bg-green-50 hover:text-green-800"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            }`}
                            title={item.archived ? "Restore" : "Archive"}
                            onClick={() => setArchiveConfirm(item)}
                          >
                            {item.archived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
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

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-700">{statNonCompliance}</div>
              <div className="mt-1 text-sm text-red-600">Critical Non-Compliance</div>
              <div className="mt-2 text-xs text-red-500">Requires immediate action</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-700">{statUpdating}</div>
              <div className="mt-1 text-sm text-orange-600">Pending Updates</div>
              <div className="mt-2 text-xs text-orange-500">In progress</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-700">{statExpired}</div>
              <div className="mt-1 text-sm text-gray-600">Expired Records</div>
              <div className="mt-2 text-xs text-gray-500">Needs renewal</div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Municipality Details</DialogTitle>
            </DialogHeader>
            {viewItem && (
              <div className="space-y-3 text-sm">
                <Row label="Municipality" value={viewItem.municipality} />
                <Row label="Province" value={viewItem.province} />
                <Row label="Barangays" value={String(viewItem.barangays)} />
                <Row label="Status">
                  <Badge variant="outline" className={statusConfig[viewItem.status].color}>
                    {statusConfig[viewItem.status].label}
                  </Badge>
                </Row>
                <Row label="Compliance %" value={`${viewItem.percentage}%`} />
                <Row label="Last Update" value={viewItem.lastUpdate} />
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Record</DialogTitle>
            </DialogHeader>
            <FormFields />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={saveEdit} disabled={!form.municipality.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Municipality</DialogTitle>
            </DialogHeader>
            <FormFields />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={saveAdd} disabled={!form.municipality.trim()}>
                Add Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!archiveConfirm} onOpenChange={() => setArchiveConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{archiveConfirm?.archived ? "Restore Record" : "Archive Record"}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to {archiveConfirm?.archived ? "restore" : "archive"}{" "}
              <strong>{archiveConfirm?.municipality}</strong>?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant={archiveConfirm?.archived ? "default" : "destructive"} onClick={confirmArchive}>
                {archiveConfirm?.archived ? "Restore" : "Archive"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      {children ?? <span className="font-medium text-gray-900">{value}</span>}
    </div>
  );
}
