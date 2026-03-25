import React from "react";
import { Building2, ClipboardCheck, Home, MapPin, Calendar, User, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LGUDirectory } from "../types/schema";

interface LGUDetailModalProps {
  lgu: LGUDirectory | null;
  onClose: () => void;
}

export function LGUDetailModal({ lgu, onClose }: LGUDetailModalProps) {
  if (!lgu) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-[#003087] p-8 text-white relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 opacity-80 mb-1">
                <MapPin className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">{lgu.region} • {lgu.province}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight">{lgu.city_municipality}</h2>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] font-black uppercase">
                  {lgu.lgu_type}
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] font-black uppercase">
                  {lgu.income_class} Class
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Building2 className="h-48 w-48" />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50">
          {/* CLUP Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#003087]">
              <ClipboardCheck className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">CLUP Progress</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current Status</p>
                <Badge className="bg-blue-50 text-[#003087] border-blue-100 font-black text-xs">
                  {lgu.clup_progress?.clup_status || 'NOT DETERMINED'}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current Phase</p>
                <p className="text-sm font-bold text-gray-700 italic">{lgu.clup_progress?.current_phase || 'None Indicated'}</p>
              </div>
            </div>
          </div>

          {/* PDPFP Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <FileText className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">PDPFP Status</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Latest Status</p>
                <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-black text-xs">
                  {lgu.pdpfp_status?.latest_status || 'NO PDPFP'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Approved</p>
                  <p className="text-sm font-black text-gray-700">{lgu.pdpfp_status?.year_approved || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">End Year</p>
                  <p className="text-sm font-black text-blue-600">{lgu.pdpfp_status?.end_year || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Housing Projects */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Home className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Housing Developments</h3>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {lgu.housing_projects && lgu.housing_projects.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {lgu.housing_projects.map(p => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-black text-gray-800">{p.project_name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{p.developer} • {p.project_type}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-gray-200 text-gray-500">
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-gray-400">No housing projects recorded for this LGU.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} className="bg-[#003087] hover:bg-[#002566] text-white font-bold px-8 rounded-xl h-12 shadow-lg shadow-blue-200">
            Close Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
