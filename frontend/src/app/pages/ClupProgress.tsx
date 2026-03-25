import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Save, RefreshCw, Trophy, Target, Activity } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useLgus } from "../LGUContext";
import { NegrosIslandMap } from "../components/NegrosIslandMap";
import { LoadingState } from "../components/LoadingState";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { Municipality, CLUPStatus } from "../types";
import { LGUDirectory } from "../types/schema";
import { PageShell } from "../components/PageShell";

// Phase-specific colors for the Progress Map
const PHASE_COLORS: Record<string, string> = {
  'Phase 1': '#60a5fa', // Blue 400
  'Phase 2': '#3b82f6', // Blue 500
  'Phase 3': '#2563eb', // Blue 600
  'Phase 4': '#1d4ed8', // Blue 700
  'RA1': '#8b5cf6',     // Violet 500
  'RA2': '#7c3aed',     // Violet 600
  'None Indicated': '#e2e8f0', // Gray 200
  'None': '#f1f5f9',    // Gray 100
};

export function ClupProgress() {
  const { lgus, isLoading, updateLgu } = useLgus();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);

  // Map data specifically for Phase Visualization
  const progressMapData = useMemo((): Municipality[] => {
    return lgus.map(l => {
      const phase = l.clup_progress?.current_phase || "None Indicated";
      // We "hijack" the status mapping temporarily for color visualization in this specific view
      let phaseColorStatus: CLUPStatus = 'no-clup';
      if (phase.includes('Phase 3') || phase.includes('RA')) phaseColorStatus = 'updated';
      else if (phase.includes('Phase 2')) phaseColorStatus = 'for-updating';
      else if (phase.includes('Phase 1')) phaseColorStatus = 'expired';

      return {
        id: String(l.id),
        name: l.city_municipality,
        province: l.province,
        clupStatus: phaseColorStatus,
        yearApproved: l.pdpfp_status?.year_approved || null,
        endYear: l.pdpfp_status?.end_year || null,
        riskInformed: false,
        integratedShelterPlan: false,
        lastUpdate: ""
      };
    });
  }, [lgus]);

  const stats = useMemo(() => {
    const hasPhase = lgus.filter(l => l.clup_progress?.current_phase && l.clup_progress.current_phase !== "None").length;
    const completionRate = Math.round((hasPhase / (lgus.length || 1)) * 100);
    return { hasPhase, completionRate };
  }, [lgus]);

  const handleMunicipalityClick = useCallback((muni: Municipality) => {
    const lgu = lgus.find(l => String(l.id) === muni.id);
    if (lgu) {
      setSelectedLgu(lgu);
      setPanelOpen(true);
    }
  }, [lgus]);

  const handlePhaseChange = (newPhase: string) => {
    if (!selectedLgu) return;
    const updated = {
      ...selectedLgu,
      clup_progress: {
        ...selectedLgu.clup_progress!,
        current_phase: newPhase
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
    <PageShell
      title="CLUP Progress Tracking"
      subtitle="Monitoring formulation phases and approval milestones across the region"
    >
      <div className="flex flex-col gap-6">
      {/* Header with Progress Overview */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-6 w-6 text-[#003087]" />
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">CLUP Progress Tracking</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">Monitoring formulation phases and approval milestones across the region</p>
        </div>

        <div className="w-full md:w-72 bg-[#003087] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Region Completion</p>
            <div className="text-4xl font-black">{stats.completionRate}%</div>
            <div className="w-full bg-white/20 h-1.5 mt-3 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.completionRate}%` }} />
            </div>
          </div>
          <Trophy className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Interactive Progress Map */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-[#003087] text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">Phase Distribution Map</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold uppercase opacity-80">Advanced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold uppercase opacity-80">Ongoing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-[9px] font-bold uppercase opacity-80">Initial</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative p-8">
            <NegrosIslandMap 
              municipalities={progressMapData} 
              onMunicipalityClick={handleMunicipalityClick}
            />
          </div>
        </div>

        {/* Phase List / Quick View */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border-none shadow-sm h-full">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest">LGU Phase Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              <div className="divide-y divide-gray-50">
                {lgus.map(l => (
                  <div key={l.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleMunicipalityClick({ id: String(l.id) } as any)}>
                    <div>
                      <p className="text-sm font-black text-gray-800">{l.city_municipality}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{l.province}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-700 font-black text-[10px] uppercase">
                      {l.clup_progress?.current_phase || "None"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Side Management Panel (consistent with the rest of the system) */}
      {panelOpen && selectedLgu && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1001]" onClick={() => setPanelOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[450px] bg-white shadow-2xl z-[1002] border-l border-gray-200 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col h-full">
              <div className="p-8 bg-[#003087] text-white">
                <Badge className="bg-emerald-400 border-none text-[#003087] text-[10px] font-black uppercase mb-2 px-3 py-1">
                  Progress Management
                </Badge>
                <h2 className="text-3xl font-black tracking-tight">{selectedLgu.city_municipality}</h2>
                <p className="text-blue-200 font-bold uppercase text-xs tracking-widest mt-1 opacity-80">{selectedLgu.province}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Formulation Phase</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'RA1', 'RA2', 'None'].map(phase => (
                      <button
                        key={phase}
                        onClick={() => handlePhaseChange(phase)}
                        className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between ${
                          selectedLgu.clup_progress?.current_phase === phase
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md ring-4 ring-emerald-50'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {phase}
                        {selectedLgu.clup_progress?.current_phase === phase && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
                <Button className="flex-1 bg-[#003087] hover:bg-[#002566] text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-blue-100" onClick={handleSave}>
                  <Save className="h-5 w-5 mr-3" />
                  Update Phase
                </Button>
                <Button variant="outline" className="flex-1 font-black uppercase tracking-widest border-gray-300 h-14 rounded-2xl" onClick={() => setPanelOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <LGUDetailModal lgu={null} onClose={() => {}} /> 
      </div>
    </PageShell>
  );
}
