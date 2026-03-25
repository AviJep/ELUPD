import React, { useRef } from "react";
import { Search, Download, Upload, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { exportToCSV, parseCSV } from "../utils/csv-helper";

interface TableToolbarProps {
  onSearch: (value: string) => void;
  onAdd?: () => void;
  onImport?: (data: any[]) => void;
  onExport?: () => void;
  filterOptions?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  title: string;
}

export function TableToolbar({ 
  onSearch, 
  onAdd, 
  onImport, 
  onExport, 
  filterOptions, 
  onFilterChange,
  title 
}: TableToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (!onImport) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const data = parseCSV(text);
        onImport?.(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 border-b border-gray-100 bg-white space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Management Console</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {onAdd && (
            <Button onClick={onAdd} className="bg-[#003087] hover:bg-[#002566] text-white font-bold text-xs uppercase h-10 px-4 rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          )}
          {onImport && (
            <Button variant="outline" onClick={handleImportClick} className="border-gray-200 font-bold text-xs uppercase h-10 px-4 rounded-xl hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2 text-blue-600" />
              Import CSV
            </Button>
          )}
          {onExport && (
            <Button variant="outline" onClick={onExport} className="border-gray-200 font-bold text-xs uppercase h-10 px-4 rounded-xl hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2 text-emerald-600" />
              Export Data
            </Button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search across all fields..." 
            className="pl-10 h-11 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#003087]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {filterOptions && (
          <div className="flex items-center gap-2">
            <div className="bg-gray-50 p-1 rounded-xl flex items-center gap-1 border border-gray-100">
              <Filter className="h-3 w-3 ml-2 text-gray-400" />
              <select 
                onChange={(e) => onFilterChange?.(e.target.value)}
                className="bg-transparent border-none text-[11px] font-black uppercase tracking-wider text-gray-500 outline-none pr-4 py-2 cursor-pointer"
              >
                <option value="all">All Provinces</option>
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
