import { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, Layers, Activity, ClipboardCheck, FileStack } from "lucide-react";
import { useLgus } from "../LGUContext";
import { NegrosIslandMap } from "../components/NegrosIslandMap";
import { NegrosProvincialMap } from "../components/NegrosProvincialMap";
import { LoadingState } from "../components/LoadingState";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { Municipality, CLUPStatus } from "../types";
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

const mapPhaseToLegacy = (phase: string | undefined): CLUPStatus => {
  const p = phase || "None";
  if (p.includes('Phase 3') || p.includes('Phase 4') || p.includes('RA')) return 'updated';
  if (p.includes('Phase 2')) return 'for-updating';
  if (p.includes('Phase 1')) return 'expired';
  return 'no-clup';
};

export function Dashboard() {
  const { lgus, isLoading } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [mapMode, setMapMode] = useState<"CLUP_STATUS" | "CLUP_PROGRESS" | "PDPFP">("CLUP_STATUS");
  
  // Filters
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  
  // Filter LGUs
  const filteredLgus = useMemo(() => {
    return lgus.filter((l) => {
      if (selectedProvince !== "All" && l.province !== selectedProvince) return false;
      if (selectedCity !== "All" && l.city_municipality !== selectedCity) return false;
      return true;
    });
  }, [selectedProvince, selectedCity, lgus]);

  // Map LGUs to the format the map component expects
  const mapData = useMemo((): Municipality[] => {
    return filteredLgus.map(l => {
      let legacyStatus: CLUPStatus = 'no-clup';
      if (mapMode === "CLUP_STATUS") {
        legacyStatus = mapSchemaStatusToLegacy(l.clup_progress?.clup_status);
      } else if (mapMode === "CLUP_PROGRESS") {
        legacyStatus = mapPhaseToLegacy(l.clup_progress?.current_phase);
      } else {
        legacyStatus = mapPDPFPToLegacy(l.pdpfp_status?.latest_status);
      }

      return {
        id: String(l.id),
        name: l.city_municipality,
        province: l.province,
        clupStatus: legacyStatus,
        yearApproved: l.pdpfp_status?.year_approved || null,
        endYear: l.pdpfp_status?.end_year || null,
        riskInformed: false,
        integratedShelterPlan: false,
        lastUpdate: l.pdpfp_status?.date_of_approval || ""
      };
    });
  }, [filteredLgus, mapMode]);

  // Aggregate Provincial Data (for PDPFP Mode)
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

  const stats = useMemo(() => {
    const total = filteredLgus.length;
    const updated = filteredLgus.filter(l => l.clup_progress?.clup_status === "Review & Approval").length;
    const forUpdating = filteredLgus.filter(l => l.clup_progress?.clup_status === "CLUP Formulation").length;
    const noClup = filteredLgus.filter(l => l.clup_progress?.clup_status === "Prephase").length;
    const expired = filteredLgus.filter(l => l.clup_progress?.clup_status === "Not Determined").length;
    
    const riskInformed = 0; 
    const integrated = 0; 

    return { 
      total, 
      updated, 
      forUpdating, 
      noClup, 
      expired,
      riskInformed,
      notRiskInformed: total - riskInformed,
      integrated,
      notIntegrated: total - integrated
    };
  }, [filteredLgus]);

  // Cities for dropdown (filtered by province)
  const availableCities = useMemo(() => {
    if (selectedProvince === "All") return lgus.map((l) => l.city_municipality);
    return lgus.filter((l) => l.province === selectedProvince).map((l) => l.city_municipality);
  }, [selectedProvince, lgus]);

  const resetFilters = () => {
    setSelectedProvince("All");
    setSelectedCity("All");
  };

  const handleMunicipalityClick = useCallback((muni: Municipality) => {
    const lgu = lgus.find(l => String(l.id) === muni.id);
    if (lgu) setSelectedLgu(lgu);
  }, [lgus]);

  if (isLoading) return <LoadingState />;

  const riskPieData = [
    { name: "Yes", value: stats.riskInformed, color: "#10b981" },
    { name: "No", value: stats.notRiskInformed, color: "#ef4444" },
  ];

  const shelterPieData = [
    { name: "Yes", value: stats.integrated, color: "#10b981" },
    { name: "No", value: stats.notIntegrated, color: "#ef4444" },
  ];

  const getMapTitle = () => {
    if (mapMode === "CLUP_STATUS") return "CLUP COMPLIANCE STATUS";
    if (mapMode === "CLUP_PROGRESS") return "CLUP FORMULATION PROGRESS";
    return "PDPFP PROVINCIAL STATUS";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-[#003087] pl-4">
          <div>
            <h1 className="text-2xl font-bold text-[#003087]">NIR Geographic Dashboard</h1>
            <p className="text-gray-600 text-sm font-medium">Environmental and Land Use Planning System</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <ModeButton 
              active={mapMode === "CLUP_STATUS"} 
              onClick={() => setMapMode("CLUP_STATUS")} 
              label="CLUP Status" 
              icon={<ClipboardCheck className="h-3 w-3" />}
            />
            <ModeButton 
              active={mapMode === "CLUP_PROGRESS"} 
              onClick={() => setMapMode("CLUP_PROGRESS")} 
              label="CLUP Progress" 
              icon={<Activity className="h-3 w-3" />}
            />
            <ModeButton 
              active={mapMode === "PDPFP"} 
              onClick={() => setMapMode("PDPFP")} 
              label="PDPFP Status" 
              icon={<FileStack className="h-3 w-3" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT - Status Cards */}
          <div className="lg:col-span-2 space-y-3">
            <StatusCard label="Updated" value={stats.updated} color="bg-green-500" />
            <StatusCard label="Expired" value={stats.expired} color="bg-yellow-500" />
            <StatusCard label="For Updating" value={stats.forUpdating} color="bg-orange-500" />
            <StatusCard label="No CLUP" value={stats.noClup} color="bg-red-600" />
          </div>

          {/* CENTER - Map */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
              <div className="bg-[#003087] text-white py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-200" />
                  <h3 className="font-semibold text-xs uppercase tracking-widest">
                    {getMapTitle()}
                  </h3>
                </div>
                <div className="flex gap-4 text-[10px]">
                  <LegendItem color="bg-green-500" label={mapMode === "CLUP_PROGRESS" ? "Advanced" : "Updated/Approved"} />
                  <LegendItem color="bg-orange-500" label={mapMode === "CLUP_PROGRESS" ? "Ongoing" : "Updating"} />
                  <LegendItem color="bg-red-500" label={mapMode === "CLUP_PROGRESS" ? "Initial" : "No Plan"} />
                </div>
              </div>
              <div className="flex-1 bg-white relative p-4">
                {mapMode === "PDPFP" ? (
                  <NegrosProvincialMap provincesData={provincialData} />
                ) : (
                  <NegrosIslandMap 
                    municipalities={mapData} 
                    onMunicipalityClick={handleMunicipalityClick}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Filters & Charts */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 p-3 flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#003087] uppercase tracking-wider">Filters</h3>
                <button onClick={resetFilters} className="text-[#003087] hover:text-blue-800 transition-colors">
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => { setSelectedProvince(e.target.value); setSelectedCity("All"); }}
                    className="w-full border border-gray-200 rounded px-2 py-2 text-sm bg-gray-50 focus:ring-1 focus:ring-[#003087] outline-none font-medium"
                  >
                    <option value="All">All Provinces</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">City/Municipality</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-2 text-sm bg-gray-50 focus:ring-1 focus:ring-[#003087] outline-none font-medium"
                  >
                    <option value="All">All Cities</option>
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <ChartCard title="Risk Informed Plans" data={riskPieData} />
            <ChartCard title="Integrated Shelter Plans" data={shelterPieData} />
          </div>
        </div>
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />
    </div>
  );
}

function ModeButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
        active 
          ? "bg-[#003087] text-white shadow-lg" 
          : "text-gray-400 hover:text-[#003087] hover:bg-blue-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-lg p-4 text-center text-white shadow-sm flex flex-col items-center justify-center h-28 transition-transform hover:scale-[1.02]`}>
      <div className="text-4xl font-black">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-1">{label}</div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-2 text-center">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-2 h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
