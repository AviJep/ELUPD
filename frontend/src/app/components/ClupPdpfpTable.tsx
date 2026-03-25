import React, { useMemo, useState } from 'react';
import { Button } from "./ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Pencil,
  Archive,
  ArrowUpDown
} from "lucide-react";
import { TableToolbar } from "./TableToolbar";
import { exportToCSV } from "../utils/csv-helper";

export interface ClupPdpfpStatus {
  id: string;
  cityMunicipality: string;
  province: string;
  planningStartYear: number | null;
  planningEndYear: number | null;
  resolutionNumber: string | null;
  clupStatus: string;
  prePhase: number;
  phase1: number;
  phase2: number;
  phase3: number;
  phase4: number;
  phase5: number;
  currentProgress: string;
}

interface ClupPdpfpTableProps {
  data: ClupPdpfpStatus[];
  onView?: (item: ClupPdpfpStatus) => void;
  onEdit?: (item: ClupPdpfpStatus) => void;
  onArchive?: (item: ClupPdpfpStatus) => void;
  onAdd?: () => void;
  onImport?: (data: any[]) => void;
}

type SortKey = keyof ClupPdpfpStatus;

export default function ClupPdpfpTable({ data, onView, onEdit, onArchive, onAdd, onImport }: ClupPdpfpTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("cityMunicipality");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 20;

  // Search & Filter
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesProvince = provinceFilter === "all" || item.province === provinceFilter;
      return matchesSearch && matchesProvince;
    });
  }, [data, searchTerm, provinceFilter]);

  // Sort
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination Math
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    exportToCSV(sortedData, `CLUP_PDPFP_Status_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const provinceOptions = useMemo(() => {
    const provinces = Array.from(new Set(data.map(d => d.province)));
    return provinces.map(p => ({ label: p, value: p }));
  }, [data]);

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      <TableToolbar 
        title="CLUP Progress (Excel Columns)"
        onSearch={setSearchTerm}
        onAdd={onAdd}
        onImport={onImport}
        onExport={handleExport}
        filterOptions={provinceOptions}
        onFilterChange={setProvinceFilter}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[#003087] font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
            <tr>
              <SortableHeader label="City/Municipality" sortKey="cityMunicipality" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("cityMunicipality")} />
              <SortableHeader label="Province" sortKey="province" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("province")} />
              <SortableHeader label="CLUP Status" sortKey="clupStatus" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("clupStatus")} />
              <SortableHeader label="Current Progress" sortKey="currentProgress" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("currentProgress")} />
              <SortableHeader label="Planning Start Year" sortKey="planningStartYear" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("planningStartYear")} />
              <SortableHeader label="Planning End Year" sortKey="planningEndYear" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("planningEndYear")} />
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 font-black text-gray-900 group-hover:text-[#003087] transition-colors">{row.cityMunicipality}</td>
                  <td className="p-4 font-medium text-gray-600">{row.province}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${getStatusColor(row.clupStatus)}`}>
                      {row.clupStatus}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-600">{row.currentProgress}</td>
                  <td className="p-4 font-bold text-gray-700">{row.planningStartYear ?? '-'}</td>
                  <td className="p-4 font-bold text-gray-700">{row.planningEndYear ?? '-'}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {onView && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50" onClick={() => onView(row)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50" onClick={() => onEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onArchive && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" onClick={() => onArchive(row)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-20 text-center text-gray-400 font-medium">No records found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 border-t border-gray-100 gap-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing <span className="text-[#003087] font-black">{sortedData.length > 0 ? startIndex + 1 : 0}</span> - <span className="text-[#003087] font-black">{Math.min(startIndex + itemsPerPage, sortedData.length)}</span> of <span className="text-[#003087] font-black">{sortedData.length}</span> records
        </span>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              className="border-gray-200 font-black text-[10px] uppercase h-9 px-4 rounded-xl shadow-sm bg-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          {currentPage < totalPages && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              className="border-gray-200 font-black text-[10px] uppercase h-9 px-4 rounded-xl shadow-sm bg-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableHeader({ label, sortKey, currentSort, order, onClick }: { label: string, sortKey: string, currentSort: string, order: "asc" | "desc", onClick: () => void }) {
  const active = currentSort === sortKey;
  return (
    <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={onClick}>
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={`h-3 w-3 transition-opacity ${active ? 'text-[#003087] opacity-100' : 'opacity-0 group-hover:opacity-30'}`} />
      </div>
    </th>
  );
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'review & approval':
    case 'updated':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'clup formulation':
    case 'for updating':
    case 'for approval':
    case 'adopted':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'prephase':
    case 'no clup':
    case 'no pdpfp':
      return 'bg-red-50 text-red-700 border-red-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
}
