import { useMemo, useState } from "react";
import ClupPdpfpTable, { ClupPdpfpStatus } from "../components/ClupPdpfpTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { LGUDirectory } from "../types/schema";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Save } from "lucide-react";

export function ComplianceMonitoring() {
  const { lgus, isLoading, updateLgu, archiveLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [editModalOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<LGUDirectory | null>(null);

  // Map backend LGUs to the detailed table interface
  const tableData = useMemo((): ClupPdpfpStatus[] => {
    return lgus.map(l => ({
      id: String(l.id),
      region: l.region,
      province: l.province,
      cityMunicipality: l.city_municipality,
      clupStatus: l.clup_progress?.clup_status || 'Not Determined',
      currentPhase: l.clup_progress?.current_phase || 'None Indicated',
      pdpfpLatestStatus: l.pdpfp_status?.latest_status || 'No PDPFP',
      dateOfApproval: l.pdpfp_status?.date_of_approval || null,
      yearAdopted: l.pdpfp_status?.year_adopted || null,
      yearApproved: l.pdpfp_status?.year_approved || null,
      endYear: l.pdpfp_status?.end_year || null
    }));
  }, [lgus]);

  if (isLoading) return <LoadingState />;

  const handleView = (item: ClupPdpfpStatus) => {
    const lgu = lgus.find(l => String(l.id) === item.id);
    if (lgu) setSelectedLgu(lgu);
  };

  const handleEdit = (item: ClupPdpfpStatus) => {
    const lgu = lgus.find(l => String(l.id) === item.id);
    if (lgu) {
      setEditData(JSON.parse(JSON.stringify(lgu))); // Deep clone for editing
      setEditOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (editData) {
      await updateLgu(editData);
      setEditOpen(false);
      setEditData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-[#003087] pl-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Compliance Status</h1>
          <p className="text-gray-500 text-sm font-medium italic">CLUP and PDPFP Compliance Tracking — Negros Island Region</p>
        </div>

        <ClupPdpfpTable 
          data={tableData}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={(item) => {
            if (window.confirm(`Archive ${item.cityMunicipality}?`)) {
              archiveLgu(Number(item.id));
            }
          }}
          onAdd={() => alert("Please add new LGUs via the LGU Directory")}
          onImport={importLgus}
        />
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />

      {/* Edit Compliance Modal */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#003087] p-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Edit Compliance</h2>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">{editData.city_municipality}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditOpen(false)} className="text-white hover:bg-white/20 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* CLUP Progress */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#003087] uppercase tracking-widest border-b pb-2">CLUP Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase">CLUP Status</Label>
                    <select 
                      value={editData.clup_progress?.clup_status || "Not Determined"}
                      onChange={e => setEditData({
                        ...editData, 
                        clup_progress: { 
                          id: editData.clup_progress?.id || 0,
                          lgu_id: editData.id,
                          clup_status: e.target.value, 
                          current_phase: editData.clup_progress?.current_phase || "None" 
                        }
                      })}
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
                    >
                      {['Prephase', 'CLUP Formulation', 'Review & Approval', 'Not Determined'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase">Current Phase</Label>
                    <Input 
                      value={editData.clup_progress?.current_phase || ""} 
                      onChange={e => setEditData({
                        ...editData,
                        clup_progress: {
                          id: editData.clup_progress?.id || 0,
                          lgu_id: editData.id,
                          clup_status: editData.clup_progress?.clup_status || "Not Determined",
                          current_phase: e.target.value
                        }
                      })}
                      className="rounded-xl h-11 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* PDPFP Status */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b pb-2 border-amber-100">PDPFP Status</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase">Latest Status</Label>
                    <select 
                      value={editData.pdpfp_status?.latest_status || "No PDPFP"}
                      onChange={e => setEditData({
                        ...editData, 
                        pdpfp_status: { 
                          id: editData.pdpfp_status?.id || 0,
                          lgu_id: editData.id,
                          latest_status: e.target.value,
                          year_approved: editData.pdpfp_status?.year_approved || null,
                          end_year: editData.pdpfp_status?.end_year || null
                        }
                      })}
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
                    >
                      {['Approved', 'Adopted', 'For Updating', 'No PDPFP', 'For Approval'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase">Year Approved</Label>
                      <Input 
                        type="number"
                        value={editData.pdpfp_status?.year_approved || ""} 
                        onChange={e => setEditData({
                          ...editData,
                          pdpfp_status: {
                            ...editData.pdpfp_status!,
                            year_approved: parseInt(e.target.value) || null
                          }
                        })}
                        className="rounded-xl h-11 border-gray-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase">End Year</Label>
                      <Input 
                        type="number"
                        value={editData.pdpfp_status?.end_year || ""} 
                        onChange={e => setEditData({
                          ...editData,
                          pdpfp_status: {
                            ...editData.pdpfp_status!,
                            end_year: parseInt(e.target.value) || null
                          }
                        })}
                        className="rounded-xl h-11 border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <Button onClick={handleSaveEdit} className="flex-1 bg-[#003087] hover:bg-[#002566] text-white font-bold h-12 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1 h-12 rounded-xl font-bold border-gray-200">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
