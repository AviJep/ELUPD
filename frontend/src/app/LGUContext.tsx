import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { LGUDirectory } from "./types/schema";
import type { AnnexClupRow, AnnexPdpfpRow } from "./data/annexData";
import { fetchAnnexRows } from "./utils/annexApi";

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "warning" | "error" | "info";
  details: string;
}

export interface ArchivedLGU extends LGUDirectory {
  archivedAt: string;
}

interface LGUContextType {
  lgus: LGUDirectory[];
  archivedLgus: ArchivedLGU[];
  logs: LogEntry[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addLgu: (lgu: Omit<LGUDirectory, "id">) => Promise<void>;
  updateLgu: (updatedLgu: LGUDirectory) => Promise<void>;
  archiveLgu: (id: number) => Promise<void>;
  restoreLgu: (id: number) => Promise<void>;
  permanentlyDeleteLgu: (id: number) => Promise<void>;
  importLgus: (data: any[]) => Promise<void>;
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

const LGUContext = createContext<LGUContextType | undefined>(undefined);

const normalizePdpfpStatus = (status: string | null | undefined): LGUDirectory["pdpfp_status"]["latest_status"] => {
  const normalized = (status || "").trim().toLowerCase();
  if (!normalized) return "No PDPFP";
  if (normalized === "approved" || normalized === "approved/updated") return "Approved";
  if (normalized === "adopted") return "Adopted";
  if (normalized === "for updating") return "For Updating";
  if (normalized === "for approval") return "For Approval";
  return "No PDPFP";
};

const toIncomeClass = (value: string | null | undefined): LGUDirectory["income_class"] => {
  const normalized = (value || "").trim();
  if (normalized === "1st" || normalized === "2nd" || normalized === "3rd" || normalized === "4th" || normalized === "5th" || normalized === "6th") {
    return normalized;
  }
  return "1st";
};

const toClupStatus = (row: AnnexClupRow): LGUDirectory["clup_progress"]["clup_status"] => {
  const status = (row.clupStatus || "").toLowerCase();
  const phase = (row.currentProgress || "").toLowerCase();

  if (status.includes("updated") || phase.includes("phase 5") || phase.includes("review") || phase.includes("ra")) {
    return "Review & Approval";
  }
  if (status.includes("for updating") || phase.includes("phase 1") || phase.includes("phase 2") || phase.includes("phase 3") || phase.includes("phase 4")) {
    return "CLUP Formulation";
  }
  if (status.includes("no clup") || phase.includes("prephase") || phase.includes("pre-phase")) {
    return "Prephase";
  }

  return "Not Determined";
};

export function LGUProvider({ children }: { children: React.ReactNode }) {
  const [lgus, setLgus] = useState<LGUDirectory[]>([]);
  const [archivedLgus, setArchivedLgus] = useState<ArchivedLGU[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load archived LGUs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("elupd_archived_lgus");
      if (stored) {
        const parsed = JSON.parse(stored) as ArchivedLGU[];
        setArchivedLgus(parsed);
      }
    } catch (error) {
      console.warn("Failed to load archived LGUs from localStorage:", error);
    }
  }, []);

  // Persist archived LGUs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("elupd_archived_lgus", JSON.stringify(archivedLgus));
    } catch (error) {
      console.warn("Failed to persist archived LGUs to localStorage:", error);
    }
  }, [archivedLgus]);

  const fetchLgus = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clupRows, pdpfpRows] = await Promise.all([
        fetchAnnexRows<AnnexClupRow>("annex-clup-status"),
        fetchAnnexRows<AnnexPdpfpRow>("annex-pdpfp-status"),
      ]);

      if (clupRows && pdpfpRows) {
        const pdpfpByProvince = new Map(pdpfpRows.map((row) => [row.province, row]));

        const mappedRows: LGUDirectory[] = clupRows.map((row, index) => {
          const id = index + 1;
          const pdpfp = pdpfpByProvince.get(row.province);

          return {
            id,
            region: "NIR",
            province: row.province,
            city_municipality: row.cityMunicipality,
            lgu_type: row.cityMunicipality.toLowerCase().includes("city") ? "CC" : "M",
            income_class: toIncomeClass(pdpfp?.incomeClassification),
            geo_json_id: "",
            clup_progress: {
              id,
              lgu_id: id,
              clup_status: toClupStatus(row),
              current_phase: row.currentProgress || "None Indicated",
            },
            pdpfp_status: pdpfp
              ? {
                  id,
                  lgu_id: id,
                  latest_status: normalizePdpfpStatus(pdpfp.status),
                  year_adopted: pdpfp.yearAdopted || undefined,
                  year_approved: pdpfp.yearApproved || undefined,
                  end_year: pdpfp.endYear || undefined,
                }
              : undefined,
            housing_projects: [],
          };
        });

        const archivedIds = new Set(archivedLgus.map((entry) => entry.id));
        setLgus(mappedRows.filter((row) => !archivedIds.has(row.id)));
      } else {
        setLgus([]);
      }
      
      if (logs.length === 0) {
        setLogs([
          {
            id: 1,
            timestamp: new Date().toISOString(),
            user: "system",
            action: "System Initialization",
            module: "Core",
            status: "success",
            details: "NIR ELUPD System v1.5.0 started successfully."
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch LGUs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [logs.length, archivedLgus.length]);

  useEffect(() => {
    fetchLgus();
  }, [fetchLgus]);

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "timestamp">) => {
    const newLog: LogEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const addLgu = async (lguData: Omit<LGUDirectory, "id">) => {
    try {
      // In a real app, this would be a POST /api/lgus
      const newLgu: LGUDirectory = {
        ...lguData,
        id: Math.max(0, ...lgus.map(l => l.id)) + 1
      };
      setLgus(prev => [...prev, newLgu]);
      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Add LGU",
        module: "Directory",
        status: "success",
        details: `Manually added ${newLgu.city_municipality}`
      });
    } catch (error) {
      console.error("Failed to add LGU:", error);
    }
  };

  const updateLgu = async (updatedLgu: LGUDirectory) => {
    try {
      setLgus(prev => prev.map(lgu => lgu.id === updatedLgu.id ? updatedLgu : lgu));
      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Update LGU",
        module: "Compliance",
        status: "success",
        details: `Updated record for ${updatedLgu.city_municipality}`
      });
    } catch (error) {
      console.error("Failed to update LGU:", error);
    }
  };

  const archiveLgu = async (id: number) => {
    try {
      const lgu = lgus.find((entry) => entry.id === id);
      if (!lgu) return;

      setArchivedLgus((prev) => {
        if (prev.some((entry) => entry.id === id)) return prev;
        return [{ ...lgu, archivedAt: new Date().toISOString() }, ...prev];
      });
      setLgus((prev) => prev.filter((entry) => entry.id !== id));

      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Archive LGU",
        module: "Compliance",
        status: "warning",
        details: `Archived record for ${lgu.city_municipality}`
      });
    } catch (error) {
      console.error("Failed to archive LGU:", error);
    }
  };

  const restoreLgu = async (id: number) => {
    try {
      const archived = archivedLgus.find((entry) => entry.id === id);
      if (!archived) return;

      const { archivedAt, ...restoredLgu } = archived;
      void archivedAt;

      setArchivedLgus((prev) => prev.filter((entry) => entry.id !== id));
      setLgus((prev) => [...prev, restoredLgu]);

      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Restore LGU",
        module: "Archive",
        status: "info",
        details: `Restored record for ${restoredLgu.city_municipality}`
      });
    } catch (error) {
      console.error("Failed to restore LGU:", error);
    }
  };

  const permanentlyDeleteLgu = async (id: number) => {
    try {
      const archived = archivedLgus.find((entry) => entry.id === id);
      setArchivedLgus((prev) => prev.filter((entry) => entry.id !== id));

      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Delete Archived LGU",
        module: "Archive",
        status: "error",
        details: `Permanently deleted archived record for ${archived?.city_municipality || id}`
      });
    } catch (error) {
      console.error("Failed to permanently delete LGU:", error);
    }
  };

  const importLgus = async (data: any[]) => {
    try {
      // Transform incoming data to LGUDirectory structure
      const newRecords = data.map((item, index) => ({
        id: Math.max(0, ...lgus.map(l => l.id)) + index + 1,
        region: item.region || "NIR",
        province: item.province || "Unknown",
        city_municipality: item.city_municipality || item.cityMunicipality || "Unknown",
        lgu_type: item.lgu_type || item.lguType || "M",
        income_class: item.income_class || item.incomeClass || "1st",
        geo_json_id: item.geo_json_id || "",
        clup_progress: item.clupStatus ? {
          clup_status: item.clupStatus,
          current_phase: item.currentPhase || "None"
        } : null,
        pdpfp_status: item.pdpfpStatus ? {
          latest_status: item.pdpfpStatus,
          year_approved: item.yearApproved || null,
          end_year: item.endYear || null
        } : null,
        housing_projects: []
      }));

      setLgus(prev => [...prev, ...newRecords]);
      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Bulk Import",
        module: "System",
        status: "success",
        details: `Imported ${newRecords.length} new records via CSV`
      });
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const value = useMemo(() => ({
    lgus,
    archivedLgus,
    logs,
    isLoading,
    refreshData: fetchLgus,
    addLgu,
    updateLgu,
    archiveLgu,
    restoreLgu,
    permanentlyDeleteLgu,
    importLgus,
    addLog
  }), [
    lgus,
    archivedLgus,
    logs,
    isLoading,
    fetchLgus,
    addLog,
  ]);

  return (
    <LGUContext.Provider value={value}>
      {children}
    </LGUContext.Provider>
  );
}

export function useLgus() {
  const context = useContext(LGUContext);
  if (context === undefined) {
    throw new Error("useLgus must be used within an LGUProvider");
  }
  return context;
}
