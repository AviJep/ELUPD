import React, { useMemo, useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Pencil, 
  Archive, 
  Search,
  Filter
} from "lucide-react";
import { LGUDirectory } from "../types/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface LGUDataTableProps {
  data: LGUDirectory[];
  onView: (lgu: LGUDirectory) => void;
  onEdit: (lgu: LGUDirectory) => void;
  onArchive: (lgu: LGUDirectory) => void;
}

export function LGUDataTable({ data, onView, onEdit, onArchive }: LGUDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter data based on search
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.city_municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.province.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header / Filters */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#003087]">LGU Compliance Directory</h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search LGU or Province..." 
            className="pl-9 bg-white border-gray-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[#003087] uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4 border-b border-gray-200">Region</th>
              <th className="px-6 py-4 border-b border-gray-200">Province</th>
              <th className="px-6 py-4 border-b border-gray-200">City / Municipality</th>
              <th className="px-6 py-4 border-b border-gray-200">Status / Phase</th>
              <th className="px-6 py-4 border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((lgu) => (
                <tr key={lgu.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{lgu.region}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lgu.province}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{lgu.city_municipality}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-bold">
                        {lgu.clup_progress?.clup_status || "N/A"}
                      </Badge>
                      <span className="text-[11px] text-gray-500 italic">
                        {lgu.clup_progress?.current_phase || "No Phase Indicated"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => onView(lgu)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => onEdit(lgu)}
                        title="Edit Record"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onArchive(lgu)}
                        title="Archive LGU"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600 font-medium">
          Showing <span className="text-[#003087]">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-[#003087]">{endIndex}</span> of{" "}
          <span className="text-[#003087]">{filteredData.length}</span> results
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex items-center gap-1 border-gray-300 h-9"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className={`h-9 w-9 p-0 ${
                  currentPage === page 
                    ? "bg-[#003087] hover:bg-[#002566]" 
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => goToPage(currentPage + 1)}
            className="flex items-center gap-1 border-gray-300 h-9"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
