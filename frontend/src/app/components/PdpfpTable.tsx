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

export interface PdpfpStatus {
  id: string;
  region: string;
  province: string;
  incomeClassification: string | null;
  version: string | null;
  startYear: number | null;
  endYear: number | null;
  resolutionApprovingPlan: string | null;
  yearApproved: number | null;
  yearAdopted: number | null;
  status: string;
  technicalAssistance: string | null;
  supportFromOtherInstitutions: string | null;
  withLocalShelterPlan: string | null;
  institutions: string | null;
  remarks: string | null;
}

interface PdpfpTableProps {
  data: PdpfpStatus[];
  onView?: (item: PdpfpStatus) => void;
  onEdit?: (item: PdpfpStatus) => void;
  onArchive?: (item: PdpfpStatus) => void;
  onAdd?: () => void;
  onImport?: (data: any[]) => void;
}

type SortKey = keyof PdpfpStatus;

export default function PdpfpTable({ data, onView, onEdit, onArchive, onAdd, onImport }: PdpfpTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("province");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 20;

  // Search & Filter
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

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
    exportToCSV(sortedData, `PDPFP_Status_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      <TableToolbar 
        title="Annex PDPFP Status (Excel Columns)"
        onSearch={setSearchTerm}
        onAdd={onAdd}
        onImport={onImport}
        onExport={handleExport}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[#003087] font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
            <tr>
              <SortableHeader label="Region" sortKey="region" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("region")} />
              <SortableHeader label="Province" sortKey="province" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("province")} />
              <SortableHeader label="Income Class" sortKey="incomeClassification" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("incomeClassification")} />
              <SortableHeader label="Status" sortKey="status" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("status")} />
              <SortableHeader label="Year Approved" sortKey="yearApproved" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("yearApproved")} />
              <SortableHeader label="Year Adopted" sortKey="yearAdopted" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("yearAdopted")} />
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 font-medium text-gray-500">{row.region}</td>
                  <td className="p-4 font-black text-gray-900 group-hover:text-[#003087] transition-colors text-base">{row.province}</td>
                  <td className="p-4 font-medium text-gray-700">{row.incomeClassification || '-'}</td>
                  <td className="p-4 font-bold text-blue-700 text-sm">{row.status}</td>
                  <td className="p-4 font-black text-gray-700 text-center">{row.yearApproved || '-'}</td>
                  <td className="p-4 font-black text-gray-700 text-center">{row.yearAdopted || '-'}</td>
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
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No records found
                </td>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-semibold text-gray-600 flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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

