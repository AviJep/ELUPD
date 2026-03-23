import { useMemo, useState } from "react";
import CityMunicipalityTable, { CityMunicipality } from "../components/CityMunicipalityTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { LGUDirectory } from "../types/schema";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Save } from "lucide-react";

export function LguDirectory() {
  const { lgus, isLoading, addLgu, archiveLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [addModalOpen, setAddOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<LGUDirectory, "id">>({
    region: "NIR",
    province: "Negros Occidental",
    city_municipality: "",
    lgu_type: "M",
    income_class: "1st",
    geo_json_id: "",
    clup_progress: null,
    pdpfp_status: null,
    housing_projects: []
  });

  const tableData = useMemo((): CityMunicipality[] => {
    return lgus.map(l => ({
      id: String(l.id),
      region: l.region,
      province: l.province,
      cityMunicipality: l.city_municipality,
      lguType: l.lgu_type,
      incomeClass: l.income_class
    }));
  }, [lgus]);

  if (isLoading) return <LoadingState />;

  const handleView = (item: CityMunicipality) => {
    const lgu = lgus.find(l => String(l.id) === item.id);
    if (lgu) setSelectedLgu(lgu);
  };

  const handleSaveAdd = async () => {
    if (!newRecord.city_municipality) return alert("Please enter a name");
    await addLgu(newRecord);
    setAddOpen(false);
    setNewRecord({
      region: "NIR",
      province: "Negros Occidental",
      city_municipality: "",
      lgu_type: "M",
      income_class: "1st",
      geo_json_id: "",
      clup_progress: null,
      pdpfp_status: null,
      housing_projects: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-blue-600 pl-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">LGU Directory</h1>
          <p className="text-gray-500 text-sm font-medium italic">General profile of cities and municipalities in Negros Island Region</p>
        </div>

        <CityMunicipalityTable 
          data={tableData}
          onView={handleView}
          onEdit={handleView}
          onArchive={(item) => {
            if (window.confirm(`Archive ${item.cityMunicipality}?`)) {
              archiveLgu(Number(item.id));
            }
          }}
          onAdd={() => setAddOpen(true)}
          onImport={importLgus}
        />
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />

      {/* Add LGU Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#003087] p-6 text-white flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight">Add New LGU</h2>
              <Button variant="ghost" size="icon" onClick={() => setAddOpen(false)} className="text-white hover:bg-white/20 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">City / Municipality Name</Label>
                <Input 
                  value={newRecord.city_municipality} 
                  onChange={e => setNewRecord({...newRecord, city_municipality: e.target.value})}
                  placeholder="e.g. San Carlos City"
                  className="rounded-xl h-11 border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">Province</Label>
                  <select 
                    value={newRecord.province}
                    onChange={e => setNewRecord({...newRecord, province: e.target.value})}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#003087]"
                  >
                    <option value="Negros Occidental">Negros Occidental</option>
                    <option value="Negros Oriental">Negros Oriental</option>
                    <option value="Siquijor">Siquijor</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">LGU Type</Label>
                  <select 
                    value={newRecord.lgu_type}
                    onChange={e => setNewRecord({...newRecord, lgu_type: e.target.value})}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#003087]"
                  >
                    <option value="M">Municipality (M)</option>
                    <option value="CC">Component City (CC)</option>
                    <option value="HUC">Highly Urbanized (HUC)</option>
                    <option value="ICC">Ind. Component (ICC)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Income Class</Label>
                <select 
                  value={newRecord.income_class}
                  onChange={e => setNewRecord({...newRecord, income_class: e.target.value})}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#003087]"
                >
                  {['1st', '2nd', '3rd', '4th', '5th', '6th'].map(c => <option key={c} value={c}>{c} Class</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <Button onClick={handleSaveAdd} className="flex-1 bg-[#003087] hover:bg-[#002566] text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-100">
                <Save className="h-4 w-4 mr-2" />
                Save LGU
              </Button>
              <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1 h-12 rounded-xl font-bold border-gray-200">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
