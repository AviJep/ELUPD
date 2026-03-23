import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { LGUDirectory } from "./types/schema";

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "warning" | "error" | "info";
  details: string;
}

interface LGUContextType {
  lgus: LGUDirectory[];
  logs: LogEntry[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addLgu: (lgu: Omit<LGUDirectory, "id">) => Promise<void>;
  updateLgu: (updatedLgu: LGUDirectory) => Promise<void>;
  archiveLgu: (id: number) => Promise<void>;
  importLgus: (data: any[]) => Promise<void>;
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

const LGUContext = createContext<LGUContextType | undefined>(undefined);

export function LGUProvider({ children }: { children: React.ReactNode }) {
  const [lgus, setLgus] = useState<LGUDirectory[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLgus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/lgus");
      if (response.ok) {
        const data = await response.json();
        setLgus(data);
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
  }, [logs.length]);

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
      const lgu = lgus.find(l => l.id === id);
      setLgus(prev => prev.filter(lgu => lgu.id !== id));
      addLog({
        user: "admin@dhsud.gov.ph",
        action: "Archive LGU",
        module: "Compliance",
        status: "warning",
        details: `Archived record for ${lgu?.city_municipality || id}`
      });
    } catch (error) {
      console.error("Failed to archive LGU:", error);
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
    logs,
    isLoading,
    refreshData: fetchLgus,
    addLgu,
    updateLgu,
    archiveLgu,
    importLgus,
    addLog
  }), [lgus, logs, isLoading, fetchLgus, addLog]);

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
