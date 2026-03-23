import { useMemo, useState } from "react";
import PdpfpTable, { PdpfpStatus } from "../components/PdpfpTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { NegrosProvincialMap } from "../components/NegrosProvincialMap";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { LGUDirectory } from "../types/schema";

const provinces = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];

const mapPDPFPToLegacy = (status: string | undefined): string => {
  switch (status) {
    case 'Approved': return 'updated';
    case 'Adopted': return 'updated';
    case 'For Updating': return 'for-updating';
    case 'For Approval': return 'for-updating';
    case 'No PDPFP': return 'no-clup';
    default: return 'no-clup';
  }
};

export function PdpfpMonitoring() {
  const { lgus, isLoading, updateLgu, archiveLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);

  // Aggregate Provincial Data for Table
  const tableData = useMemo((): PdpfpStatus[] => {
    return provinces.map(provName => {
      const provinceLgus = lgus.filter(l => l.province === provName);
      const pdpfp = provinceLgus.find(l => l.pdpfp_status)?.pdpfp_status;
      
      return {
        id: `prov-${provName}`,
        province: provName,
        latestStatus: pdpfp?.latest_status || "No PDPFP",
        dateOfApproval: pdpfp?.date_of_approval || null,
        yearAdopted: pdpfp?.year_adopted || null,
        yearApproved: pdpfp?.year_approved || null,
        endYear: pdpfp?.end_year || null
      };
    });
  }, [lgus]);

  // Aggregate Provincial Data for Map
  const provincialMapData = useMemo(() => {
    return tableData.map(d => ({
      name: d.province,
      status: d.latestStatus,
      legacyStatus: mapPDPFPToLegacy(d.latestStatus) as any
    }));
  }, [tableData]);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-amber-600 pl-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">PDPFP Monitoring</h1>
          <p className="text-gray-500 text-sm font-medium italic">Provincial Development and Physical Framework Plan Status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Provincial Map Synchronization - Now consistent size */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-full min-h-[400px] flex flex-col">
              <div className="bg-[#003087] text-white py-4 px-6 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">Regional PDPFP Map</h3>
              </div>
              <div className="flex-1 p-4">
                <NegrosProvincialMap provincesData={provincialMapData} />
              </div>
            </div>
          </div>

          {/* Data List Synchronization */}
          <div className="lg:col-span-8">
            <PdpfpTable 
              data={tableData}
              onView={(item) => alert(`Provincial Status: ${item.province}\nLatest: ${item.latestStatus}`)}
              onEdit={(item) => console.log("Edit Provincial PDPFP", item)}
              onArchive={(item) => console.log("Archive Provincial PDPFP", item)}
              onImport={importLgus}
            />
          </div>
        </div>
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />
    </div>
  );
}
