import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface Province {
  id: number;
  name: string;
  municipalities?: number;
  barangays?: number;
  status?: string;
}

export interface Municipality {
  id: number;
  name: string;
  province: string;
  barangays?: number;
  status?: string;
  lastUpdate?: string;
}

export interface Barangay {
  id: number;
  name: string;
  municipality: string;
  province: string;
  population?: number;
  status?: string;
}

export interface ComplianceRecord {
  id: number;
  municipality?: string;
  province?: string;
  reportDate?: string;
  status?: string;
  officer?: string;
  planStartYear?: number;
  planEndYear?: number;
  resolutionNumber?: string;
  approvalDate?: string;
  hardCopyAvailable?: boolean;
  softCopyUrl?: string;
}

const DEFAULT_COMPLIANCE_RECORDS: ComplianceRecord[] = [];

export interface SystemLog {
  id: number;
  timestamp?: string;
  user?: string;
  action?: string;
  module?: string;
  status?: string;
  details?: string;
}

export interface RecentActivity {
  location: string;
  action: string;
  time: string;
}

export interface ApiDataContextValue {
  isLoading: boolean;
  provinces: Province[];
  municipalities: Municipality[];
  barangays: Barangay[];
  complianceRecords: ComplianceRecord[];
  systemLogs: SystemLog[];
  archives: any[];
  refresh: () => Promise<void>;
  addProvince: (province: Province) => void;
  addMunicipality: (municipality: Municipality) => void;
  addBarangay: (barangay: Barangay) => void;
  addComplianceRecord: (record: Partial<ComplianceRecord>) => Promise<ComplianceRecord | null>;
  addComplianceRecords: (records: Partial<ComplianceRecord>[]) => Promise<ComplianceRecord[]>;
  updateComplianceRecord: (record: Partial<ComplianceRecord> & { id: number }) => Promise<ComplianceRecord | null>;
  archiveComplianceRecord: (recordId: number) => Promise<void>;
  resetData: () => Promise<void>;
  addSystemLog: (log: SystemLog) => void;
}

const LOCAL_STORAGE_KEY = "clup_compliance_cache";

const ApiDataContext = createContext<ApiDataContextValue | null>(null);

export const ApiDataProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const tempIdRef = useRef(-1);

  const allocateTempId = useCallback(() => {
    const next = tempIdRef.current;
    tempIdRef.current -= 1;
    return next;
  }, []);

  const getLocalCache = (): ComplianceRecord[] => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  };

  const setLocalCache = (records: ComplianceRecord[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  };

  const normalizeRecord = (record: any): ComplianceRecord => {
    const planStartYear =
      record.planStartYear ??
      record.planStart ??
      record["Plan Start"] ??
      record["Plan Start Year"] ??
      record["plan_start_year"];

    const planEndYear =
      record.planEndYear ??
      record.planEnd ??
      record["Plan End"] ??
      record["Plan End Year"] ??
      record["plan_end_year"];

    const resolutionNumber =
      record.resolutionNumber ??
      record.resolution ??
      record["Resolution No."] ??
      record["Resolution Number"] ??
      record["resolution_no"];

    const approvalDate =
      record.approvalDate ??
      record["Approval Date"] ??
      record["approval_date"];

    const hardCopyAvailable =
      record.hardCopyAvailable ??
      record["Hard Copy"] ??
      record["Hard Copy Available"] ??
      record.hard_copy_available;

    const normalized: ComplianceRecord = {
      id: record.id,
      province: record.province ?? record.Province ?? record.prov ?? "",
      municipality:
        record.municipality ?? record.Municipality ?? record.city ?? "",
      reportDate: record.reportDate ?? record.report_date ?? "",
      status: record.status ?? record.Status ?? "",
      officer: record.officer ?? record.Officer ?? "",
      planStartYear:
        typeof planStartYear === "number"
          ? planStartYear
          : planStartYear
          ? Number(planStartYear)
          : undefined,
      planEndYear:
        typeof planEndYear === "number"
          ? planEndYear
          : planEndYear
          ? Number(planEndYear)
          : undefined,
      resolutionNumber: resolutionNumber ?? "",
      approvalDate: approvalDate ?? "",
      hardCopyAvailable: Boolean(hardCopyAvailable),
      softCopyUrl:
        record.softCopyUrl ?? record["Soft Copy"] ?? record["Soft Copy URL"] ?? "",
    };

    return normalized;
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const localCache = getLocalCache();

      const [provRes, munRes, barRes, compRes, logRes, archiveRes] = await Promise.all([
        fetch("/api/provinces"),
        fetch("/api/municipalities"),
        fetch("/api/barangays"),
        fetch("/api/compliance"),
        fetch("/api/logs"),
        fetch("/api/archives"),
      ]);

      const [provData, munData, barData, compData, logData, archiveData] = await Promise.all([
        provRes.ok ? provRes.json() : [],
        munRes.ok ? munRes.json() : [],
        barRes.ok ? barRes.json() : [],
        compRes.ok ? compRes.json() : [],
        logRes.ok ? logRes.json() : [],
        archiveRes.ok ? archiveRes.json() : [],
      ]);

      setProvinces(Array.isArray(provData) ? provData : []);
      setMunicipalities(Array.isArray(munData) ? munData : []);
      setBarangays(Array.isArray(barData) ? barData : []);

      const fetchedCompliance = Array.isArray(compData) ? compData : [];

      // Merge backend + local cache while preserving all imported rows.
      // Use *id* when available to avoid duplicates, but allow multiple records per municipality.
      const byId = new Map<number, ComplianceRecord>();
      const noIdRecords: ComplianceRecord[] = [];

      for (const rec of fetchedCompliance) {
        const normalized = normalizeRecord(rec);
        if (normalized.id != null) {
          byId.set(normalized.id, normalized);
        } else {
          noIdRecords.push(normalized);
        }
      }

      for (const rec of localCache) {
        const normalized = normalizeRecord(rec);
        if (normalized.id != null) {
          if (!byId.has(normalized.id)) {
            byId.set(normalized.id, normalized);
          }
        } else {
          noIdRecords.push(normalized);
        }
      }

      // Ensure all records have a stable id so selection behaves correctly
      let nextTempId = tempIdRef.current;
      const finalList = [
        ...Array.from(byId.values()).map((r) => {
          if (r.id == null) {
            const generatedId = nextTempId;
            nextTempId -= 1;
            return { ...r, id: generatedId };
          }
          return r;
        }),
        ...noIdRecords.map((r) => {
          if (r.id == null) {
            const generatedId = nextTempId;
            nextTempId -= 1;
            return { ...r, id: generatedId };
          }
          return r;
        }),
      ];
      tempIdRef.current = nextTempId;

      setComplianceRecords(finalList);
      setLocalCache(finalList);

      setSystemLogs(Array.isArray(logData) ? logData : []);
      setArchives(Array.isArray(archiveData) ? archiveData : []);
    } catch {
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
      setComplianceRecords(getLocalCache());
      setSystemLogs([]);
      setArchives([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const addProvince = useCallback((province: Province) => {
    setProvinces((prev) => [...prev, province]);
  }, []);

  const addMunicipality = useCallback((municipality: Municipality) => {
    setMunicipalities((prev) => [...prev, municipality]);
  }, []);

  const addBarangay = useCallback((barangay: Barangay) => {
    setBarangays((prev) => [...prev, barangay]);
  }, []);

  const addComplianceRecord = useCallback(
    async (record: Partial<ComplianceRecord>) => {
      const normalizedRecord = normalizeRecord(record);

      try {
        const response = await fetch("/api/compliance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedRecord),
        });
        if (!response.ok) {
          throw new Error("Failed to create record");
        }
        let saved: ComplianceRecord = normalizeRecord(await response.json());
        if (saved.id == null) {
          saved = { ...saved, id: allocateTempId() } as ComplianceRecord;
        }
        setComplianceRecords((prev) => {
          const next = [...prev, saved];
          setLocalCache(next);
          return next;
        });
        return saved;
      } catch (error) {
        console.warn("API create failed, storing locally:", error);
        const newTempId = allocateTempId();
        const fallback: ComplianceRecord = {
          id: newTempId,
          ...normalizedRecord,
        } as ComplianceRecord;
        setComplianceRecords((prev) => {
          const next = [...prev, fallback];
          setLocalCache(next);
          return next;
        });
        return fallback;
      }
    },
    [allocateTempId]
  );

  const addComplianceRecords = useCallback(
    async (records: Partial<ComplianceRecord>[]) => {
      const created: ComplianceRecord[] = [];
      for (const record of records) {
        const saved = await addComplianceRecord(record);
        if (saved) {
          created.push(saved);
        }
      }
      return created;
    },
    [addComplianceRecord]
  );

  const updateComplianceRecord = useCallback(
    async (updated: Partial<ComplianceRecord> & { id: number }) => {
      const normalizedUpdate = normalizeRecord(updated);
      try {
        const response = await fetch(`/api/compliance/${updated.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedUpdate),
        });
        if (!response.ok) {
          throw new Error("Failed to update record");
        }
        const saved: ComplianceRecord = normalizeRecord(await response.json());
        setComplianceRecords((prev) =>
          prev.map((r) => (r.id === saved.id ? saved : r))
        );
        return saved;
      } catch (error) {
        console.warn("API update failed, updating locally:", error);
        setComplianceRecords((prev) =>
          prev.map((r) => (r.id === updated.id ? { ...r, ...normalizedUpdate } : r))
        );
        return normalizedUpdate as ComplianceRecord;
      }
    },
    []
  );

  const archiveComplianceRecord = useCallback(async (recordId: number) => {
    const recordToArchive = complianceRecords.find((r) => r.id === recordId);

    if (recordToArchive) {
      try {
        const archivePayload = {
          municipality: recordToArchive.municipality ?? "",
          province: recordToArchive.province ?? "",
          records: 1,
          archivedDate: new Date().toISOString(),
          reason: "Archived from CLUP / PDPFPD Monitoring",
        };

        const archiveRes = await fetch("/api/archives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(archivePayload),
        });

        if (archiveRes.ok) {
          const archiveRecord = await archiveRes.json();
          setArchives((prev) => [archiveRecord, ...prev]);
        }
      } catch (error) {
        console.warn("Failed to create archive record:", error);
      }
    }

    try {
      await fetch(`/api/compliance/${recordId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("API delete failed, removing locally:", error);
    }

    setComplianceRecords((prev) => {
      const next = prev.filter((r) => r.id !== recordId);
      setLocalCache(next);
      return next;
    });
  }, [complianceRecords]);

  const resetData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/reset-db/", { method: "POST" });
    } catch (error) {
      console.warn("Failed to reset database:", error);
    }

    setLocalCache([]);
    setProvinces([]);
    setMunicipalities([]);
    setBarangays([]);
    setComplianceRecords([]);
    setSystemLogs([]);
    setArchives([]);
    tempIdRef.current = -1;
    setIsLoading(false);
  }, []);

  const addSystemLog = useCallback((log: SystemLog) => {
    setSystemLogs((prev) => [...prev, log]);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      provinces,
      municipalities,
      barangays,
      complianceRecords,
      systemLogs,
      archives,
      refresh: fetchData,
      addProvince,
      addMunicipality,
      addBarangay,
      addComplianceRecord,
      addComplianceRecords,
      updateComplianceRecord,
      archiveComplianceRecord,
      resetData,
      addSystemLog,
    }),
    [
      isLoading,
      provinces,
      municipalities,
      barangays,
      complianceRecords,
      systemLogs,
      archives,
      fetchData,
      addProvince,
      addMunicipality,
      addBarangay,
      addComplianceRecord,
      addComplianceRecords,
      updateComplianceRecord,
      archiveComplianceRecord,
      resetData,
      addSystemLog,
    ]
  );

  return <ApiDataContext.Provider value={value}>{children}</ApiDataContext.Provider>;
};

export function useApiData() {
  const context = useContext(ApiDataContext);
  if (!context) {
    throw new Error("useApiData must be used within ApiDataProvider");
  }
  return context;
}
