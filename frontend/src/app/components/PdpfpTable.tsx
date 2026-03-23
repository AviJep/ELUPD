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
  province: string;
  latestStatus: string;
  dateOfApproval: string | Date | null;
  yearAdopted: number | null;
  yearApproved: number | null;
  endYear: number | null;
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
  const itemsPerPage = 10;

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
        title="Provincial PDPFP Status"
        onSearch={setSearchTerm}
        onAdd={onAdd || (() => {})}
        onImport={onImport || (() => {})}
        onExport={handleExport}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 whitespace-nowrap">
          <thead className="bg-gray-50/50 text-[#003087] font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
            <tr>
              <SortableHeader label="Province" sortKey="province" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("province")} />
              <SortableHeader label="Latest Status" sortKey="latestStatus" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("latestStatus")} />
              <SortableHeader label="Date of Approval" sortKey="dateOfApproval" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("dateOfApproval")} />
              <SortableHeader label="Year Adopted" sortKey="yearAdopted" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("yearAdopted")} />
              <SortableHeader label="Year Approved" sortKey="yearApproved" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("yearApproved")} />
              <SortableHeader label="End Year" sortKey="endYear" currentSort={sortKey} order={sortOrder} onClick={() => handleSort("endYear")} />
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 font-black text-gray-900 group-hover:text-[#003087] transition-colors text-lg">{row.province}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm ${getStatusColor(row.latestStatus)}`}>
                      {row.latestStatus}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-500">{String(row.dateOfApproval || '-')}</td>
                  <td className="p-4 font-black text-gray-700">{row.yearAdopted || '-'}</td>
                  <td className="p-4 font-black text-gray-700">{row.yearApproved || '-'}</td>
                  <td className="p-4 font-black text-[#003087]">{row.endYear || '-'}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50" onClick={() => onView?.(row)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50" onClick={() => onEdit?.(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" onClick={() => onArchive?.(row)}>
                        <Archive className="h-4 w-4" />
                      </Button>
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
          <Button 
            variant="outline"
            size="sm"
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="border-gray-200 font-black text-[10px] uppercase h-9 px-4 rounded-xl shadow-sm bg-white"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || sortedData.length === 0} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="border-gray-200 font-black text-[10px] uppercase h-9 px-4 rounded-xl shadow-sm bg-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
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

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'adopted':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'for updating':
    case 'for approval':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'no pdpfp':
      return 'bg-red-50 text-red-700 border-red-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
}
