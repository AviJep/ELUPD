import { useMemo, useState } from "react";
import HousingTable, { HousingProject } from "../components/HousingTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { LGUDirectory } from "../types/schema";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Save } from "lucide-react";

export function HousingMonitoring() {
  const { lgus, isLoading, updateLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [addModalOpen, setAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    lguId: "",
    projectName: "",
    developer: "",
    projectType: "Subdivision",
    status: "Ongoing"
  });

  const tableData = useMemo((): HousingProject[] => {
    const flattened: HousingProject[] = [];
    lgus.forEach(l => {
      if (l.housing_projects) {
        l.housing_projects.forEach(p => {
          flattened.push({
            id: String(p.id),
            region: l.region,
            province: l.province,
            cityMunicipality: l.city_municipality,
            projectName: p.project_name,
            developer: p.developer,
            projectType: p.project_type,
            status: p.status
          });
        });
      }
    });
    return flattened;
  }, [lgus]);

  if (isLoading) return <LoadingState />;

  const handleView = (item: HousingProject) => {
    const lgu = lgus.find(l => l.city_municipality === item.cityMunicipality);
    if (lgu) setSelectedLgu(lgu);
  };

  const handleArchiveProject = async (item: HousingProject) => {
    const lgu = lgus.find((entry) => entry.city_municipality === item.cityMunicipality && entry.province === item.province);
    if (!lgu) return;

    if (!window.confirm(`Archive project ${item.projectName}?`)) return;

    const updatedLgu = {
      ...lgu,
      housing_projects: (lgu.housing_projects || []).filter((project) => String(project.id) !== item.id),
    };

    await updateLgu(updatedLgu);
  };

  const handleSaveAdd = async () => {
    if (!newProject.projectName || !newProject.lguId) return alert("Please fill in required fields");
    
    const lgu = lgus.find(l => String(l.id) === newProject.lguId);
    if (lgu) {
      const updatedLgu = {
        ...lgu,
        housing_projects: [
          ...(lgu.housing_projects || []),
          {
            id: Date.now(),
            lgu_id: lgu.id,
            project_name: newProject.projectName,
            developer: newProject.developer,
            project_type: newProject.projectType,
            status: newProject.status
          }
        ]
      };
      await updateLgu(updatedLgu);
      setAddOpen(false);
      setNewProject({
        lguId: "",
        projectName: "",
        developer: "",
        projectType: "Subdivision",
        status: "Ongoing"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1 border-l-4 border-emerald-600 pl-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Housing Projects</h1>
          <p className="text-gray-500 text-sm font-medium italic">Monitoring of residential and urban development projects in NIR</p>
        </div>

        <HousingTable 
          data={tableData}
          onView={handleView}
          onEdit={handleView}
          onArchive={(item) => {
            void handleArchiveProject(item);
          }}
          onAdd={() => setAddOpen(true)}
          onImport={importLgus}
        />
      </div>

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />

      {/* Add Project Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight">New Housing Project</h2>
              <Button variant="ghost" size="icon" onClick={() => setAddOpen(false)} className="text-white hover:bg-white/20 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Target LGU</Label>
                <select 
                  value={newProject.lguId}
                  onChange={e => setNewProject({...newProject, lguId: e.target.value})}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
                >
                  <option value="">Select City / Municipality</option>
                  {lgus.map(l => <option key={l.id} value={l.id}>{l.city_municipality}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Project Name</Label>
                <Input 
                  value={newProject.projectName} 
                  onChange={e => setNewProject({...newProject, projectName: e.target.value})}
                  placeholder="e.g. Sunny Heights Subdivision"
                  className="rounded-xl h-11 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Developer</Label>
                <Input 
                  value={newProject.developer} 
                  onChange={e => setNewProject({...newProject, developer: e.target.value})}
                  placeholder="e.g. SMDC"
                  className="rounded-xl h-11 border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">Project Type</Label>
                  <select 
                    value={newProject.projectType}
                    onChange={e => setNewProject({...newProject, projectType: e.target.value})}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
                  >
                    <option value="Subdivision">Subdivision</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Socialized">Socialized</option>
                    <option value="Mixed-use">Mixed-use</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">Status</Label>
                  <select 
                    value={newProject.status}
                    onChange={e => setNewProject({...newProject, status: e.target.value})}
                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposed">Proposed</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <Button onClick={handleSaveAdd} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Add Project
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
