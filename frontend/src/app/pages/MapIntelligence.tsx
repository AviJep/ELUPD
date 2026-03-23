import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Plus, Trash2, Save, RefreshCw, Layers } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useLgus } from "../LGUContext";
import { NegrosIslandMap } from "../components/NegrosIslandMap";
import { NegrosProvincialMap } from "../components/NegrosProvincialMap";
import { LoadingState } from "../components/LoadingState";
import { CLUPStatus, Municipality, CLUP_STATUS_LABELS } from "../types";
import { LGUDirectory } from "../types/schema";

const provinces = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];

// Map the new schema status to the legacy status for map colors
const mapSchemaStatusToLegacy = (status: string | undefined): CLUPStatus => {
  switch (status) {
    case 'Review & Approval': return 'updated';
    case 'CLUP Formulation': return 'for-updating';
    case 'Prephase': return 'no-clup';
    case 'Not Determined': return 'expired';
    default: return 'no-clup';
  }
};

const mapLegacyToSchemaStatus = (status: CLUPStatus): string => {
  switch (status) {
    case 'updated': return 'Review & Approval';
    case 'for-updating': return 'CLUP Formulation';
    case 'no-clup': return 'Prephase';
    case 'expired': return 'Not Determined';
    default: return 'Prephase';
  }
};

const mapPDPFPToLegacy = (status: string | undefined): CLUPStatus => {
  switch (status) {
    case 'Approved': return 'updated';
    case 'Adopted': return 'updated';
    case 'For Updating': return 'for-updating';
    case 'For Approval': return 'for-updating';
    case 'No PDPFP': return 'no-clup';
    default: return 'no-clup';
  }
};

export function MapIntelligence() {
  const { lgus, isLoading, updateLgu } = useLgus();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [mapMode, setMapMode] = useState<"CLUP" | "PDPFP">("CLUP");

  // Transform LGUs for the map component
  const mapData = useMemo((): Municipality[] => {
    return lgus.map(l => ({
      id: String(l.id),
      name: l.city_municipality,
      province: l.province,
      clupStatus: mapMode === "CLUP" 
        ? mapSchemaStatusToLegacy(l.clup_progress?.clup_status)
        : mapPDPFPToLegacy(l.pdpfp_status?.latest_status),
      yearApproved: l.pdpfp_status?.year_approved || null,
      endYear: l.pdpfp_status?.end_year || null,
      riskInformed: false,
      integratedShelterPlan: false,
      lastUpdate: l.pdpfp_status?.date_of_approval || ""
    }));
  }, [lgus, mapMode]);

  // Provincial Data for PDPFP
  const provincialData = useMemo(() => {
    return provinces.map(provName => {
      const provinceLgus = lgus.filter(l => l.province === provName);
      const pdpfpStatus = provinceLgus.find(l => l.pdpfp_status)?.pdpfp_status;
      return {
        name: provName,
        status: pdpfpStatus?.latest_status || "No PDPFP",
        legacyStatus: mapPDPFPToLegacy(pdpfpStatus?.latest_status) as any,
      };
    });
  }, [lgus]);

  const handleMunicipalityClick = useCallback((muni: Municipality) => {
    const lgu = lgus.find(l => String(l.id) === muni.id);
    if (lgu) {
      setSelectedLgu(lgu);
      setPanelOpen(true);
    }
  }, [lgus]);

  const handleStatusChange = (newLegacyStatus: CLUPStatus) => {
    if (!selectedLgu) return;
    
    const updated = {
      ...selectedLgu,
      clup_progress: {
        ...selectedLgu.clup_progress,
        id: selectedLgu.clup_progress?.id || 0,
        lgu_id: selectedLgu.id,
        clup_status: mapLegacyToSchemaStatus(newLegacyStatus),
        current_phase: selectedLgu.clup_progress?.current_phase || 'Updated via Map Intelligence'
      }
    };
    
    setSelectedLgu(updated as LGUDirectory);
  };

  const handleSave = () => {
    if (selectedLgu) {
      updateLgu(selectedLgu);
      setPanelOpen(false);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="h-[calc(100vh-64px)] relative flex bg-slate-50">
      {/* Main Map Area */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-full max-h-[850px]">
          <div className="bg-[#003087] text-white py-5 px-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-4 w-4 text-blue-200" />
                <h2 className="text-xl font-black uppercase tracking-tight">Regional Intelligence</h2>
              </div>
              <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest opacity-80">Interactive {mapMode} Management System</p>
            </div>
            
            <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
              <button 
                onClick={() => setMapMode("CLUP")}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  mapMode === "CLUP" ? "bg-white text-[#003087] shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                CLUP
              </button>
              <button 
                onClick={() => setMapMode("PDPFP")}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  mapMode === "PDPFP" ? "bg-white text-[#003087] shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                PDPFP
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative bg-white p-8">
            {mapMode === "CLUP" ? (
              <NegrosIslandMap 
                municipalities={mapData} 
                onMunicipalityClick={handleMunicipalityClick}
              />
            ) : (
              <NegrosProvincialMap 
                provincesData={provincialData}
              />
            )}
          </div>

          <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100 flex items-center justify-center gap-8">
            <LegendItem color="bg-green-500" label={mapMode === "CLUP" ? "Updated" : "Approved"} />
            <LegendItem color="bg-orange-500" label="Updating" />
            <LegendItem color="bg-red-500" label={mapMode === "CLUP" ? "No CLUP" : "No PDPFP"} />
          </div>
        </div>
      </div>

      {/* Side Management Panel */}
      {panelOpen && selectedLgu && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1001]" onClick={() => setPanelOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[450px] bg-white shadow-2xl z-[1002] border-l border-gray-200 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col h-full">
              <div className="p-8 bg-[#003087] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <Badge className="bg-white/20 border-none text-white text-[10px] font-black uppercase mb-2 px-3 py-1">
                    Management Mode
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tight">{selectedLgu.city_municipality}</h2>
                  <p className="text-blue-200 font-bold uppercase text-xs tracking-widest mt-1 opacity-80">{selectedLgu.province}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)} className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full">
                  <X className="h-6 w-6" />
                </Button>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Layers className="h-48 w-48" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Status Section */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CLUP Compliance Status</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['updated', 'for-updating', 'no-clup', 'expired'] as CLUPStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                          mapSchemaStatusToLegacy(selectedLgu.clup_progress?.clup_status) === s
                            ? 'bg-blue-50 border-[#003087] text-[#003087] shadow-md ring-4 ring-blue-50'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                        }`}
                      >
                        {CLUP_STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan Info */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PDPFP Data (Provincial)</Label>
                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-500 uppercase">Approval Year</Label>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 font-black text-gray-700">{selectedLgu.pdpfp_status?.year_approved || 'N/A'}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-500 uppercase">End Year</Label>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 font-black text-blue-600">{selectedLgu.pdpfp_status?.end_year || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-500 uppercase">Current Phase</Label>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 font-bold text-gray-600 italic">
                        {selectedLgu.clup_progress?.current_phase || 'No Phase Indicated'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                  <RefreshCw className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                    Propagation: Changes made here will update the central database and reflect on all regional analytics instantly.
                  </p>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
                <Button className="flex-1 bg-[#003087] hover:bg-[#002566] text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-blue-100" onClick={handleSave}>
                  <Save className="h-5 w-5 mr-3" />
                  Commit Changes
                </Button>
                <Button variant="outline" className="flex-1 font-black uppercase tracking-widest border-gray-300 h-14 rounded-2xl hover:bg-gray-100" onClick={() => setPanelOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</span>
    </div>
  );
}
