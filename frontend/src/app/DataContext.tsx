import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Municipality, CLUPStatus } from "./types";
import { nirMunicipalities } from "./utils/clup-data";

// ─── Log Entry ──────────────────────────────────────────────────────

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "warning" | "error" | "info";
  details: string;
}

// ─── Status mapping between CLUP and compliance ────────────────────

export type ComplianceStatus = "updated" | "updating" | "non-compliance" | "expired";

const clupToCompliance: Record<CLUPStatus, ComplianceStatus> = {
  updated: "updated",
  "for-updating": "updating",
  "no-clup": "non-compliance",
  expired: "expired",
};

const complianceToClup: Record<ComplianceStatus, CLUPStatus> = {
  updated: "updated",
  updating: "for-updating",
  "non-compliance": "no-clup",
  expired: "expired",
};

export { clupToCompliance, complianceToClup };

// ─── Context shape ──────────────────────────────────────────────────

interface DataContextType {
  municipalities: Municipality[];
  updateMunicipality: (id: string, updates: Partial<Municipality>) => void;
  addMunicipality: (m: Municipality) => void;
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// ─── Seed logs ──────────────────────────────────────────────────────

const SEED_LOGS: LogEntry[] = [
  { id: 1, timestamp: "2026-03-04 14:23:45", user: "admin@dhsud.gov.ph", action: "Data Export", module: "Compliance Monitoring", status: "success", details: "Exported 248 records to CSV" },
  { id: 2, timestamp: "2026-03-04 13:15:22", user: "officer@dhsud.gov.ph", action: "Status Update", module: "Compliance Monitoring", status: "success", details: "Updated Bacolod City status to Updated" },
  { id: 3, timestamp: "2026-03-04 12:08:11", user: "admin@dhsud.gov.ph", action: "Record Archive", module: "Compliance Monitoring", status: "success", details: "Archived 45 outdated records" },
  { id: 4, timestamp: "2026-03-04 10:55:19", user: "system", action: "Data Import", module: "Compliance Monitoring", status: "success", details: "Imported CSV with 156 records" },
  { id: 5, timestamp: "2026-03-04 10:12:44", user: "officer@dhsud.gov.ph", action: "Login", module: "Authentication", status: "success", details: "User logged in successfully" },
  { id: 6, timestamp: "2026-03-04 09:30:28", user: "admin@dhsud.gov.ph", action: "System Backup", module: "System", status: "success", details: "Database backup completed" },
  { id: 7, timestamp: "2026-03-04 08:45:15", user: "officer@dhsud.gov.ph", action: "Report Generated", module: "Statistics", status: "success", details: "Generated monthly compliance report" },
  { id: 8, timestamp: "2026-03-03 17:22:03", user: "admin@dhsud.gov.ph", action: "Data Update", module: "Dashboard", status: "warning", details: "Partial update — 2 records failed validation" },
  { id: 9, timestamp: "2026-03-03 16:10:56", user: "system", action: "Auto Sync", module: "System", status: "success", details: "Synchronized map data with database" },
  { id: 10, timestamp: "2026-03-03 14:18:27", user: "admin@dhsud.gov.ph", action: "Permission Change", module: "User Management", status: "success", details: "Updated user permissions for officer@dhsud.gov.ph" },
];

// ─── Provider ───────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>(nirMunicipalities);
    const addMunicipality = useCallback(
      (m: Municipality) => {
        setMunicipalities((prev) => [...prev, m]);
      },
      [],
    );
  const [logs, setLogs] = useState<LogEntry[]>(SEED_LOGS);

  const addLog = useCallback(
    (entry: Omit<LogEntry, "id" | "timestamp">) => {
      setLogs((prev) => [
        {
          ...entry,
          id: prev.length + 1,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        },
        ...prev,
      ]);
    },
    [],
  );

  const updateMunicipality = useCallback(
    (id: string, updates: Partial<Municipality>) => {
      setMunicipalities((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      );
    },
    [],
  );

  return (
    <DataContext.Provider value={{ municipalities, updateMunicipality, addMunicipality, logs, addLog }}>
      {children}
    </DataContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
