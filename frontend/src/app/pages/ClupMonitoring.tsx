import { useMemo, useState } from "react";
import ClupTable, { ClupPdpfpStatus as ClupStatus } from "../components/ClupPdpfpTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { LGUDirectory } from "../types/schema";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { NegrosIslandMap } from "../components/NegrosIslandMap";
import { Municipality, CLUPStatus } from "../types";

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

export function ClupMonitoring() {
  const { lgus, isLoading, updateLgu, archiveLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);

  // Map backend LGUs to the detailed table interface
  const tableData = useMemo((): ClupStatus[] => {
    return lgus.map(l => ({
      id: String(l.id),
      cityMunicipality: l.city_municipality,
      province: l.province,
      planningStartYear: null,
      planningEndYear: null,
      resolutionNumber: null,
      clupStatus: l.clup_progress?.clup_status || 'Not Determined',
      prePhase: 0,
      phase1: 0,
      phase2: 0,
      phase3: 0,
      phase4: 0,
      phase5: 0,
      currentProgress: l.clup_progress?.current_phase || 'None Indicated',
    }));
  }, [lgus]);

  const mapData = useMemo((): Municipality[] => {
    return lgus.map(l => ({
      id: String(l.id),
      name: l.city_municipality,
      province: l.province,
      clupStatus: mapSchemaStatusToLegacy(l.clup_progress?.clup_status),
      yearApproved: l.pdpfp_status?.year_approved || null,
      endYear: l.pdpfp_status?.end_year || null,
      riskInformed: false,
      integratedShelterPlan: false,
      lastUpdate: l.pdpfp_status?.date_of_approval || ""
    }));
  }, [lgus]);

  if (isLoading) return <LoadingState />;

  const handleView = (item: ClupStatus) => {
    const lgu = lgus.find(l => String(l.id) === item.id);
    if (lgu) setSelectedLgu(lgu);
  };

  const handleArchive = (item: ClupStatus) => {
    if (window.confirm(`Archive ${item.cityMunicipality}?`)) {
      archiveLgu(Number(item.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-[#003087] pl-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">CLUP Monitoring</h1>
          <p className="text-gray-500 text-sm font-medium italic">Comprehensive Land Use Plan Compliance tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LGU Map synchronization */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-full min-h-[400px] flex flex-col">
              <div className="bg-[#003087] text-white py-4 px-6 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">LGU Compliance Map</h3>
              </div>
              <div className="flex-1 p-4">
                <NegrosIslandMap 
                  municipalities={mapData} 
                  onMunicipalityClick={(m) => handleView({ id: m.id } as any)}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ClupTable 
              data={tableData}
              onView={handleView}
              onArchive={handleArchive}
              onImport={importLgus}
            />
          </div>
        </div>
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />
    </div>
  );
}
