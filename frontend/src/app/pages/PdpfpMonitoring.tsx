import { useMemo, useState } from "react";
import PdpfpTable, { PdpfpStatus } from "../components/PdpfpTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { NegrosProvincialMap } from "../components/NegrosProvincialMap";
import { PageShell } from "../components/PageShell";

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
  const { lgus, isLoading, importLgus, archiveLgu } = useLgus();
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<{
    title: string;
    fields: Array<{ label: string; value: string }>;
  } | null>(null);

  // Aggregate Provincial Data for Table
  const tableData = useMemo((): PdpfpStatus[] => {
    return provinces.map(provName => {
      const provinceLgus = lgus.filter(l => l.province === provName);
      const pdpfp = provinceLgus.find(l => l.pdpfp_status)?.pdpfp_status;
      
      return {
        id: `prov-${provName}`,
        region: provinceLgus[0]?.region ?? "NIR",
        province: provName,
        incomeClassification: provinceLgus[0]?.income_class ?? null,
        version: null,
        startYear: null,
        endYear: pdpfp?.end_year || null,
        resolutionApprovingPlan: null,
        yearApproved: pdpfp?.year_approved || null,
        yearAdopted: pdpfp?.year_adopted || null,
        status: pdpfp?.latest_status || "No PDPFP",
        technicalAssistance: null,
        supportFromOtherInstitutions: null,
        withLocalShelterPlan: null,
        institutions: null,
        remarks: null,
      };
    });
  }, [lgus]);

  // Aggregate Provincial Data for Map
  const provincialMapData = useMemo(() => {
    return tableData.map(d => ({
      name: d.province,
      status: d.status,
      legacyStatus: mapPDPFPToLegacy(d.status) as any
    }));
  }, [tableData]);

  const toDetailFields = (record: Record<string, unknown>) => {
    return Object.entries(record)
      .filter(([key]) => key !== "id")
      .map(([key, value]) => {
        const label = key
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        let displayValue = "-";
        if (value !== null && value !== undefined && value !== "") {
          const isBooleanLikeField = /^prePhase$|^phase[1-5]$/i.test(key) || /withLocalShelterPlan/i.test(key);
          if (isBooleanLikeField) {
            const asText = String(value).trim().toLowerCase();
            if (value === true || value === 1 || asText === "1" || asText === "true") {
              displayValue = "true";
            } else if (value === false || value === 0 || asText === "0" || asText === "false") {
              displayValue = "false";
            } else {
              displayValue = String(value);
            }
            return { label, value: displayValue };
          }

          if (typeof value === "number") {
            displayValue = String(value);
          } else if (typeof value === "boolean") {
            displayValue = value ? "Yes" : "No";
          } else {
            displayValue = String(value);
          }
        }

        return { label, value: displayValue };
      });
  };

  const openRecordDetail = (title: string, record: Record<string, unknown>) => {
    setSelectedRecordDetail({
      title,
      fields: toDetailFields(record),
    });
  };

  const handleArchiveProvince = async (province: string) => {
    const provinceLgus = lgus.filter((lgu) => lgu.province === province);
    if (provinceLgus.length === 0) {
      window.alert(`No LGU records found to archive for ${province}.`);
      return;
    }

    if (window.confirm(`Archive all LGU records under ${province}? (${provinceLgus.length} record${provinceLgus.length > 1 ? "s" : ""})`)) {
      await Promise.all(provinceLgus.map((lgu) => archiveLgu(lgu.id)));
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="PDPFP Monitoring"
      subtitle="Provincial Development and Physical Framework Plan status"
    >
      <div className="space-y-6">

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
              onView={(item) => openRecordDetail(item.province, item as unknown as Record<string, unknown>)}
              onEdit={(item) => openRecordDetail(`${item.province} (Edit Preview)`, item as unknown as Record<string, unknown>)}
              onArchive={(item) => {
                void handleArchiveProvince(item.province);
              }}
              onImport={importLgus}
            />
          </div>
        </div>
      </div>

      {selectedRecordDetail && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRecordDetail(null)}
          />
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="px-6 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
              <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">View All Details</p>
              <h3 className="text-xl font-black mt-1">{selectedRecordDetail.title}</h3>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedRecordDetail.fields.map((field) => (
                  <div key={field.label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{field.label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1 break-words">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedRecordDetail(null)}
                className="bg-[#003087] hover:bg-[#0a4aa3] text-white font-bold px-6 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>

  );
}
