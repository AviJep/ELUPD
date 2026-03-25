import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import {
  Map as MapIcon,
  Route,
  MapPinned,
  RotateCcw,
  Filter,
  TableProperties,
  Gauge,
} from "lucide-react";
import { provinces, computeStats } from "../utils/clup-data";
import { useLgus } from "../LGUContext";
import { NegrosIslandMap } from "../components/NegrosIslandMap";
import { NegrosProvincialMap } from "../components/NegrosProvincialMap";
import CityMunicipalityTable, {
  CityMunicipality,
} from "../components/CityMunicipalityTable";
import ClupPdpfpTable, {
  ClupPdpfpStatus,
} from "../components/ClupPdpfpTable";
import PdpfpTable, { PdpfpStatus } from "../components/PdpfpTable";
import { LGUDetailModal } from "../components/LGUDetailModal";
import type { CLUPStatus, Municipality } from "../types";
import type { LGUDirectory } from "../types/schema";
import {
  type AnnexClupRow,
  type AnnexPdpfpRow,
} from "../data/annexData";
import { fetchAnnexRows } from "../utils/annexApi";

type MapMode = "clup" | "clup-progress" | "pdpfp";

const PDPFP_PROVINCES = ["Negros Occidental", "Negros Oriental", "Siquijor"];

const normalizeName = (name: string) => {
  // Remove "City of" prefix and "City" suffix variations
  // Examples: "City of Bacolod" → "bacolod", "Bacolod City" → "bacolod"
  return name
    .replace(/^city\s+of\s+/i, "") // Remove "City of" prefix
    .replace(/\s+city$/i, "") // Remove "City" suffix
    .trim()
    .toLowerCase();
};

const mapSchemaStatusToLegacy = (status: string | undefined): CLUPStatus => {
  switch ((status || "").toLowerCase()) {
    case "review & approval":
      return "updated";
    case "clup formulation":
      return "for-updating";
    case "prephase":
      return "no-clup";
    default:
      return "no-clup";
  }
};

const mapClupStatusToLegacy = (status: string | null | undefined): CLUPStatus => {
  switch ((status || "").toLowerCase()) {
    case "updated":
      return "updated";
    case "for updating":
      return "for-updating";
    case "no clup":
      return "no-clup";
    case "expired":
      return "expired";
    default:
      return "no-clup";
  }
};

const mapAnnexProgressStatus = (
  currentProgress: string | null | undefined,
  clupStatus: string | null | undefined,
): "Prephase" | "CLUP Formulation" | "Review & Approval" | "Not Determined" => {
  const phase = (currentProgress || "").toLowerCase();
  const status = (clupStatus || "").toLowerCase();

  if (phase.includes("prephase") || phase.includes("pre-phase")) return "Prephase";
  if (phase.includes("phase 1") || phase.includes("phase 2") || phase.includes("phase 3") || phase.includes("phase 4")) {
    return "CLUP Formulation";
  }
  if (phase.includes("phase 5") || phase.includes("ra") || phase.includes("review")) return "Review & Approval";

  if (phase.includes("none indicated") && status.includes("updated")) return "Review & Approval";

  return "Not Determined";
};

const mapPhaseToLegacy = (phase: string | undefined): CLUPStatus => {
  const currentPhase = (phase || "none").toLowerCase();
  if (currentPhase.includes("phase 3") || currentPhase.includes("phase 4") || currentPhase.includes("ra")) return "updated";
  if (currentPhase.includes("phase 2") || currentPhase.includes("formulation")) return "for-updating";
  if (currentPhase.includes("phase 1")) return "expired";
  return "no-clup";
};

const normalizePdpfpStatus = (status: string | null | undefined): string => {
  const normalized = (status || "").trim().toLowerCase();

  if (!normalized) return "No PDPFP";
  if (normalized === "approved" || normalized === "approved/updated") return "Approved";
  if (normalized === "adopted") return "Adopted";
  if (normalized === "for updating") return "For Updating";
  if (normalized === "for approval") return "For Approval";
  if (normalized === "no ppfp" || normalized === "no pdpfp") return "No PDPFP";

  return status || "No PDPFP";
};

const mapPDPFPToLegacy = (status: string | undefined): CLUPStatus => {
  switch (normalizePdpfpStatus(status).toLowerCase()) {
    case "approved":
    case "adopted":
      return "updated";
    case "for updating":
    case "for approval":
      return "for-updating";
    default:
      return "no-clup";
  }
};

const toPhaseFlag = (value: unknown): 0 | 1 => {
  if (value === true || value === 1 || value === "1") return 1;
  return 0;
};

export function Dashboard() {
  const { lgus, importLgus, archiveLgu } = useLgus();
  const [activeMapMode, setActiveMapMode] = useState<MapMode>("clup");
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<{
    title: string;
    fields: Array<{ label: string; value: string }>;
  } | null>(null);
  const [annexClupRows, setAnnexClupRows] = useState<AnnexClupRow[]>([]);
  const [annexPdpfpRows, setAnnexPdpfpRows] = useState<AnnexPdpfpRow[]>([]);
  const [annexLoading, setAnnexLoading] = useState(true);
  const [annexError, setAnnexError] = useState<string | null>(null);

  // Filters
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCurrentProgress, setSelectedCurrentProgress] = useState<string>("All");
  const [selectedIncomeClass, setSelectedIncomeClass] = useState<string>("All");
  const [yearAdoptedRange, setYearAdoptedRange] = useState<[number, number]>([1905, 2026]);
  const [yearApprovalRange, setYearApprovalRange] = useState<[number, number]>([1900, 2026]);
  const [endYearRange, setEndYearRange] = useState<[number, number]>([0, 2050]);

  useEffect(() => {
    let active = true;

    const loadAnnexRows = async () => {
      setAnnexLoading(true);
      setAnnexError(null);

      const [clupRows, pdpfpRows] = await Promise.all([
        fetchAnnexRows<AnnexClupRow>("annex-clup-status"),
        fetchAnnexRows<AnnexPdpfpRow>("annex-pdpfp-status"),
      ]);

      if (!active) return;
      if (!clupRows || !pdpfpRows) {
        setAnnexError("Unable to load live annex data from Django API.");
        setAnnexLoading(false);
        return;
      }

      setAnnexClupRows(clupRows);
      setAnnexPdpfpRows(pdpfpRows);
      setAnnexLoading(false);
    };

    void loadAnnexRows();

    return () => {
      active = false;
    };
  }, []);

  const nirLgus = useMemo(() => lgus.filter((lgu) => PDPFP_PROVINCES.includes(lgu.province)), [lgus]);

  const clupMunicipalities = useMemo<Municipality[]>(() => {
    return annexClupRows
      .filter((row) => PDPFP_PROVINCES.includes(row.province))
      .map((row, index) => ({
        id: `annex-clup-${index + 1}`,
        name: row.cityMunicipality,
        province: row.province,
        clupStatus: mapClupStatusToLegacy(row.clupStatus),
        yearApproved: row.planningStartYear ?? null,
        endYear: row.planningEndYear ?? null,
        riskInformed: false,
        integratedShelterPlan: false,
        lastUpdate: "",
      }));
  }, [annexClupRows]);

  const sourceProgressLgus = useMemo(() => {
    const pdpfpByProvince = new Map(annexPdpfpRows.map((row) => [row.province, row]));

    return annexClupRows
      .filter((row) => PDPFP_PROVINCES.includes(row.province))
      .map((row, index) => {
        const pdpfp = pdpfpByProvince.get(row.province);
        return {
          id: index + 1,
          region: "NIR",
          province: row.province,
          city_municipality: row.cityMunicipality,
          lgu_type: row.cityMunicipality.toLowerCase().includes("city") ? "CC" : "M",
          income_class: pdpfp?.incomeClassification || "N/A",
          clup_progress: {
            clup_status: mapAnnexProgressStatus(row.currentProgress, row.clupStatus),
            current_phase: row.currentProgress || "None Indicated",
          },
          pdpfp_status: pdpfp
            ? {
                latest_status: normalizePdpfpStatus(pdpfp.status),
                date_of_approval: null,
                year_adopted: pdpfp.yearAdopted,
                year_approved: pdpfp.yearApproved,
                end_year: pdpfp.endYear,
              }
            : null,
        };
      });
  }, [annexClupRows, annexPdpfpRows]);

  // Filter municipalities
  const filteredMunicipalities = useMemo(() => {
    return clupMunicipalities.filter((m) => {
      if (selectedProvince !== "All" && m.province !== selectedProvince) return false;
      if (selectedCity !== "All" && m.name !== selectedCity) return false;
      if (selectedStatus !== "All" && m.clupStatus !== selectedStatus) return false;
      if (m.yearApproved !== null) {
        if (m.yearApproved < yearApprovalRange[0] || m.yearApproved > yearApprovalRange[1]) return false;
      }
      if (m.endYear !== null) {
        if (m.endYear < endYearRange[0] || m.endYear > endYearRange[1]) return false;
      }
      return true;
    });
  }, [clupMunicipalities, selectedProvince, selectedCity, selectedStatus, yearApprovalRange, endYearRange]);

  const stats = computeStats(filteredMunicipalities);

  const filteredProgressLgus = useMemo(() => {
    return sourceProgressLgus.filter((lgu) => {
      if (selectedProvince !== "All" && lgu.province !== selectedProvince) return false;
      if (selectedCity !== "All" && lgu.city_municipality !== selectedCity) return false;
      if (selectedStatus !== "All") {
        const clupStatus = (lgu.clup_progress?.clup_status || "Not Determined").toLowerCase();
        if (clupStatus !== selectedStatus.toLowerCase()) return false;
      }
      if (selectedCurrentProgress !== "All") {
        const currentPhase = lgu.clup_progress?.current_phase || "None Indicated";
        if (currentPhase !== selectedCurrentProgress) return false;
      }
      if (selectedIncomeClass !== "All" && lgu.income_class !== selectedIncomeClass) return false;
      return true;
    });
  }, [sourceProgressLgus, selectedProvince, selectedCity, selectedStatus, selectedCurrentProgress, selectedIncomeClass]);

  const progressMunicipalities = useMemo((): Municipality[] => {
    return filteredProgressLgus.map((lgu) => ({
      id: String(lgu.id),
      name: lgu.city_municipality,
      province: lgu.province,
      clupStatus: mapSchemaStatusToLegacy(lgu.clup_progress?.clup_status),
      yearApproved: lgu.pdpfp_status?.year_approved || null,
      endYear: lgu.pdpfp_status?.end_year || null,
      riskInformed: false,
      integratedShelterPlan: false,
      lastUpdate: "",
    }));
  }, [filteredProgressLgus]);

  const filteredProgressMunicipalities = progressMunicipalities;

  const progressStats = computeStats(filteredProgressMunicipalities);

  // Cities for dropdown (filtered by province)
  const availableCities = useMemo(() => {
    const source = activeMapMode === "clup-progress"
      ? filteredProgressLgus.map((lgu) => ({ name: lgu.city_municipality, province: lgu.province }))
      : clupMunicipalities.map((m) => ({ name: m.name, province: m.province }));

    if (selectedProvince === "All") return source.map((m) => m.name);
    return source.filter((m) => m.province === selectedProvince).map((m) => m.name);
  }, [clupMunicipalities, filteredProgressLgus, selectedProvince, activeMapMode]);

  const directoryTableData = useMemo((): CityMunicipality[] => {
    return filteredMunicipalities.map((m) => ({
      id: `seed-${normalizeName(m.name)}`,
      cityMunicipality: m.name,
      province: m.province,
      planningStartYear: annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.planningStartYear ?? null,
      planningEndYear: annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.planningEndYear ?? null,
      resolutionNumber: annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.resolutionNumber ?? null,
      clupStatus: annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.clupStatus ?? null,
      prePhase: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.prePhase),
      phase1: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.phase1),
      phase2: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.phase2),
      phase3: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.phase3),
      phase4: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.phase4),
      phase5: toPhaseFlag(annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.phase5),
      currentProgress: annexClupRows.find((r) => normalizeName(r.cityMunicipality) === normalizeName(m.name) && r.province === m.province)?.currentProgress || "None Indicated",
    }));
  }, [filteredMunicipalities, annexClupRows]);

  const clupProgressTableData = useMemo((): ClupPdpfpStatus[] => {
    return filteredProgressLgus
      .filter((lgu) => {
        return true;
      })
      .map((lgu) => {
        const clup = annexClupRows.find(
          (row) => normalizeName(row.cityMunicipality) === normalizeName(lgu.city_municipality) && row.province === lgu.province,
        );

        return {
          id: String(lgu.id),
          cityMunicipality: lgu.city_municipality,
          province: lgu.province,
          planningStartYear: clup?.planningStartYear ?? null,
          planningEndYear: clup?.planningEndYear ?? null,
          resolutionNumber: clup?.resolutionNumber ?? null,
          clupStatus: clup?.clupStatus || "Not Determined",
          prePhase: toPhaseFlag(clup?.prePhase),
          phase1: toPhaseFlag(clup?.phase1),
          phase2: toPhaseFlag(clup?.phase2),
          phase3: toPhaseFlag(clup?.phase3),
          phase4: toPhaseFlag(clup?.phase4),
          phase5: toPhaseFlag(clup?.phase5),
          currentProgress: clup?.currentProgress || "None Indicated",
        };
      });
  }, [filteredProgressLgus, annexClupRows]);

  const pdpfpTableData = useMemo((): PdpfpStatus[] => {
    return annexPdpfpRows
      .filter((row) => selectedProvince === "All" || selectedProvince === row.province)
      .reduce<PdpfpStatus[]>((acc, row) => {
        const normalizedStatus = normalizePdpfpStatus(row.status);

        if (selectedStatus !== "All" && normalizedStatus !== selectedStatus) {
          return acc;
        }

        const yearAdopted = row.yearAdopted || null;
        const yearApproved = row.yearApproved || null;
        const endYear = row.endYear || null;

        if (yearAdopted !== null && (yearAdopted < yearAdoptedRange[0] || yearAdopted > yearAdoptedRange[1])) return acc;
        if (yearApproved !== null && (yearApproved < yearApprovalRange[0] || yearApproved > yearApprovalRange[1])) return acc;
        if (endYear !== null && (endYear < endYearRange[0] || endYear > endYearRange[1])) return acc;

        acc.push({
          id: `prov-${row.province}`,
          region: row.region,
          province: row.province,
          incomeClassification: row.incomeClassification,
          version: row.version,
          startYear: row.startYear,
          endYear: row.endYear,
          resolutionApprovingPlan: row.resolutionApprovingPlan,
          yearApproved: row.yearApproved,
          yearAdopted,
          status: normalizedStatus,
          technicalAssistance: row.technicalAssistance,
          supportFromOtherInstitutions: row.supportFromOtherInstitutions,
          withLocalShelterPlan: row.withLocalShelterPlan,
          institutions: row.institutions,
          remarks: row.remarks,
        });

        return acc;
      }, []);
  }, [annexPdpfpRows, selectedProvince, selectedStatus, yearAdoptedRange, yearApprovalRange, endYearRange]);

  const provincialMapData = useMemo(() => {
    return pdpfpTableData.map((item) => ({
      name: item.province,
      status: item.status,
      legacyStatus: mapPDPFPToLegacy(item.status),
      approvedYear: item.yearApproved,
      endYear: item.endYear,
    }));
  }, [pdpfpTableData]);

  const pdpfpSummary = useMemo(() => {
    const approved = pdpfpTableData.filter((item) => item.status === "Approved").length;
    const adopted = pdpfpTableData.filter((item) => item.status === "Adopted").length;
    const forUpdating = pdpfpTableData.filter((item) => {
      return item.status === "For Updating" || item.status === "For Approval";
    }).length;
    const noPlan = pdpfpTableData.filter((item) => item.status === "No PDPFP").length;

    return { approved, adopted, forUpdating, noPlan, total: pdpfpTableData.length };
  }, [pdpfpTableData]);

  const clupProgressSummary = useMemo(() => {
    const prephase = filteredProgressLgus.filter((l) => (l.clup_progress?.clup_status || "").toLowerCase() === "prephase").length;
    const formulation = filteredProgressLgus.filter((l) => (l.clup_progress?.clup_status || "").toLowerCase() === "clup formulation").length;
    const reviewApproval = filteredProgressLgus.filter((l) => (l.clup_progress?.clup_status || "").toLowerCase() === "review & approval").length;
    const notDetermined = filteredProgressLgus.filter((l) => !l.clup_progress?.clup_status || (l.clup_progress?.clup_status || "").toLowerCase() === "not determined").length;
    return { prephase, formulation, reviewApproval, notDetermined };
  }, [filteredProgressLgus]);

  const lguTypeBarData = useMemo(() => {
    const types = ["ICC", "HUC", "CC", "M"] as const;
    return types.map((type) => ({
      type,
      count: filteredProgressLgus.filter((lgu) => lgu.lgu_type === type).length,
    }));
  }, [filteredProgressLgus]);

  const provincialIncomeClassData = useMemo(() => {
    const classes = ["1st", "2nd", "3rd", "4th", "5th"] as const;
    return classes
      .map((incomeClass) => ({
        name: incomeClass,
        value: annexPdpfpRows.filter((l) => l.incomeClassification === incomeClass).length,
      }))
      .filter((item) => item.value > 0);
  }, [annexPdpfpRows]);

  const handleMunicipalityClick = (municipality: Municipality) => {
    const match = nirLgus.find(
      (lgu) => normalizeName(lgu.city_municipality) === normalizeName(municipality.name),
    );
    if (match) setSelectedLgu(match);
  };

  const handleViewLguById = (id: string) => {
    const match = nirLgus.find((lgu) => String(lgu.id) === id);
    if (match) setSelectedLgu(match);
  };

  const handleViewLguByCity = (cityMunicipality: string) => {
    const match = nirLgus.find(
      (lgu) => normalizeName(lgu.city_municipality) === normalizeName(cityMunicipality),
    );
    if (match) {
      setSelectedLgu(match);
      return;
    }
    window.alert(`No detailed LGU profile available yet for ${cityMunicipality}.`);
  };

  const handleArchiveByCityProvince = async (cityMunicipality: string, province: string) => {
    const target = lgus.find(
      (lgu) => lgu.province === province && normalizeName(lgu.city_municipality) === normalizeName(cityMunicipality),
    );

    if (!target) {
      window.alert(`Unable to archive ${cityMunicipality}: record not found.`);
      return;
    }

    if (window.confirm(`Archive ${cityMunicipality}?`)) {
      await archiveLgu(target.id);
    }
  };

  const handleArchiveProvinceRecords = async (province: string) => {
    const provinceLgus = lgus.filter((lgu) => lgu.province === province);
    if (provinceLgus.length === 0) {
      window.alert(`No LGU records found to archive for ${province}.`);
      return;
    }

    if (window.confirm(`Archive all LGU records under ${province}? (${provinceLgus.length} record${provinceLgus.length > 1 ? "s" : ""})`)) {
      await Promise.all(provinceLgus.map((lgu) => archiveLgu(lgu.id)));
    }
  };

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
          const isPhaseField = /^prePhase$|^phase[1-5]$/i.test(key);

          if (isPhaseField) {
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

  const activeMapMunicipalities =
    activeMapMode === "clup" ? filteredMunicipalities : filteredProgressMunicipalities;

  // Reset filters
  const resetFilters = () => {
    setSelectedProvince("All");
    setSelectedCity("All");
    setSelectedStatus("All");
    setSelectedCurrentProgress("All");
    setSelectedIncomeClass("All");
    setYearAdoptedRange([1905, 2026]);
    setYearApprovalRange([1900, 2026]);
    setEndYearRange([0, 2050]);
  };

  // Pie chart data
  const riskPieData = [
    { name: "Yes", value: stats.riskInformed, color: "#10b981" },
    { name: "No", value: stats.notRiskInformed, color: "#ef4444" },
  ];

  const shelterPieData = [
    { name: "Yes", value: stats.integrated, color: "#10b981" },
    { name: "No", value: stats.notIntegrated, color: "#ef4444" },
  ];

  const riskPct = stats.total > 0 ? ((stats.riskInformed / stats.total) * 100).toFixed(2) : "0";
  const noRiskPct = stats.total > 0 ? ((stats.notRiskInformed / stats.total) * 100).toFixed(2) : "0";
  const shelterPct = stats.total > 0 ? ((stats.integrated / stats.total) * 100).toFixed(2) : "0";
  const noShelterPct = stats.total > 0 ? ((stats.notIntegrated / stats.total) * 100).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50 to-emerald-50/60 relative overflow-x-hidden">
      <div className="absolute -top-32 -left-16 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {annexLoading && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">
            Loading live annex data from Django API...
          </div>
        )}
        {annexError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {annexError}
          </div>
        )}

        <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#003087] via-[#0a4aa3] to-[#026c7c] text-white shadow-2xl shadow-blue-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-100">DHSUD NIR</p>
              <h1 className="text-2xl md:text-3xl font-black leading-tight mt-2">
                ELUPD Dashboard
              </h1>
              <p className="text-sm md:text-base text-blue-100 mt-1">
                CLUP, CLUP Progress, and PDPFP interactive mapping and monitoring center
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">Data Snapshot</p>
              <p className="font-black text-lg">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <MapModeButton
              active={activeMapMode === "clup"}
              icon={<MapIcon className="h-4 w-4" />}
              title="CLUP Map"
              subtitle="Municipality-level status"
              onClick={() => setActiveMapMode("clup")}
            />
            <MapModeButton
              active={activeMapMode === "clup-progress"}
              icon={<Route className="h-4 w-4" />}
              title="CLUP Progress Map"
              subtitle="Phase-based progression"
              onClick={() => setActiveMapMode("clup-progress")}
            />
            <MapModeButton
              active={activeMapMode === "pdpfp"}
              icon={<MapPinned className="h-4 w-4" />}
              title="PDPFP Map"
              subtitle="Provincial plan status"
              onClick={() => setActiveMapMode("pdpfp")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 rounded-3xl bg-white shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-blue-100 font-bold">Active Spatial View</p>
                <h2 className="text-lg font-black">
                  {activeMapMode === "clup" && "CLUP Status Map"}
                  {activeMapMode === "clup-progress" && "CLUP Progress Tracking Map"}
                  {activeMapMode === "pdpfp" && "PDPFP Provincial Monitoring Map"}
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[11px] font-bold">
                {activeMapMode === "clup" && (
                  <>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Updated</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> For Updating</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-300" /> Expired</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> No CLUP</span>
                  </>
                )}
                {activeMapMode === "clup-progress" && (
                  <>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Prephase</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> CLUP Formulation</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Review &amp; Approval</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Not Determined</span>
                  </>
                )}
                {activeMapMode === "pdpfp" && (
                  <>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Approved</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> For Approval</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> For Updating</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> No PDPFP</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 md:p-4">
              {activeMapMode === "pdpfp" ? (
                <NegrosProvincialMap provincesData={provincialMapData} />
              ) : (
                <NegrosIslandMap
                  municipalities={activeMapMunicipalities}
                  onMunicipalityClick={handleMunicipalityClick}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-900 text-white flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">Dashboard Filters</h3>
              </div>

              <FilterSection label="Province">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity("All");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="All">All Provinces</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </FilterSection>

              <FilterSection label="City or Municipality">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="All">All LGUs</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </FilterSection>

              {activeMapMode === "clup" && (
                <FilterSection label="CLUP Status">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="updated">Updated</option>
                    <option value="for-updating">For Updating</option>
                    <option value="no-clup">No CLUP</option>
                    <option value="expired">Expired</option>
                  </select>
                </FilterSection>
              )}

              {activeMapMode === "clup-progress" && (
                <>
                  <FilterSection label="CLUP Status">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                    >
                      <option value="All">All</option>
                      <option value="Prephase">Prephase</option>
                      <option value="CLUP Formulation">CLUP Formulation</option>
                      <option value="Review & Approval">Review & Approval</option>
                      <option value="Not Determined">Not Determined</option>
                    </select>
                  </FilterSection>

                  <FilterSection label="Current Progress">
                    <select
                      value={selectedCurrentProgress}
                      onChange={(e) => setSelectedCurrentProgress(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                    >
                      <option value="All">All</option>
                      {[...new Set(sourceProgressLgus.map((l) => l.clup_progress?.current_phase || "None Indicated"))].map((phase) => (
                        <option key={phase} value={phase}>{phase}</option>
                      ))}
                    </select>
                  </FilterSection>

                  <FilterSection label="Income Class">
                    <select
                      value={selectedIncomeClass}
                      onChange={(e) => setSelectedIncomeClass(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                    >
                      <option value="All">All</option>
                      {[...new Set(sourceProgressLgus.map((l) => l.income_class))].map((incomeClass) => (
                        <option key={incomeClass} value={incomeClass}>{incomeClass}</option>
                      ))}
                    </select>
                  </FilterSection>
                </>
              )}

              {activeMapMode === "pdpfp" && (
                <FilterSection label="Status">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Adopted">Adopted</option>
                    <option value="For Updating">For Updating</option>
                    <option value="For Approval">For Approval</option>
                    <option value="No PDPFP">No PDPFP</option>
                  </select>
                </FilterSection>
              )}

              {activeMapMode !== "clup-progress" && (
                <FilterSection label={activeMapMode === "pdpfp" ? "Year Adopted" : "Year of Approval Range"}>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={activeMapMode === "pdpfp" ? yearAdoptedRange[0] : yearApprovalRange[0]}
                    onChange={(e) => {
                      if (activeMapMode === "pdpfp") {
                        setYearAdoptedRange([Number(e.target.value), yearAdoptedRange[1]]);
                      } else {
                        setYearApprovalRange([Number(e.target.value), yearApprovalRange[1]]);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                    min={1900}
                    max={2030}
                  />
                  <input
                    type="number"
                    value={activeMapMode === "pdpfp" ? yearAdoptedRange[1] : yearApprovalRange[1]}
                    onChange={(e) => {
                      if (activeMapMode === "pdpfp") {
                        setYearAdoptedRange([yearAdoptedRange[0], Number(e.target.value)]);
                      } else {
                        setYearApprovalRange([yearApprovalRange[0], Number(e.target.value)]);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                    min={1900}
                    max={2030}
                  />
                </div>
              </FilterSection>
              )}

              {activeMapMode === "pdpfp" && (
                <FilterSection label="Year Approved">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={yearApprovalRange[0]}
                      onChange={(e) => setYearApprovalRange([Number(e.target.value), yearApprovalRange[1]])}
                      className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                      min={1900}
                      max={2030}
                    />
                    <input
                      type="number"
                      value={yearApprovalRange[1]}
                      onChange={(e) => setYearApprovalRange([yearApprovalRange[0], Number(e.target.value)])}
                      className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                      min={1900}
                      max={2030}
                    />
                  </div>
                </FilterSection>
              )}

              {activeMapMode !== "clup-progress" && (
                <FilterSection label="End Year">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={endYearRange[0]}
                    onChange={(e) => setEndYearRange([Number(e.target.value), endYearRange[1]])}
                    className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                    min={0}
                    max={2060}
                  />
                  <input
                    type="number"
                    value={endYearRange[1]}
                    onChange={(e) => setEndYearRange([endYearRange[0], Number(e.target.value)])}
                    className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-sm"
                    min={0}
                    max={2060}
                  />
                </div>
              </FilterSection>
              )}

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {activeMapMode === "clup" && (
            <>
              <div className="xl:col-span-8 rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
                  <h3 className="text-sm font-black uppercase tracking-wider">Planning Intelligence</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50/40">
                    <p className="text-[11px] font-bold text-gray-500 uppercase">Risk Informed Plans</p>
                    <ResponsiveContainer width="100%" height={170}>
                      <PieChart>
                        <Pie data={riskPieData} cx="50%" cy="50%" outerRadius={54} dataKey="value" label={({ name, value }) => `${value} (${name === "Yes" ? riskPct : noRiskPct}%)`}>
                          {riskPieData.map((entry, index) => (<Cell key={`risk-${index}`} fill={entry.color} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50/40">
                    <p className="text-[11px] font-bold text-gray-500 uppercase">With Integrated Local Shelter Plan</p>
                    <ResponsiveContainer width="100%" height={170}>
                      <PieChart>
                        <Pie data={shelterPieData} cx="50%" cy="50%" outerRadius={54} dataKey="value" label={({ name, value }) => `${value} (${name === "Yes" ? shelterPct : noShelterPct}%)`}>
                          {shelterPieData.map((entry, index) => (<Cell key={`shelter-${index}`} fill={entry.color} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <h3 className="text-sm font-black uppercase tracking-wider">CLUP Status Summary</h3>
                </div>
                <div className="p-5 grid grid-cols-2 xl:grid-cols-1 gap-3">
                  <StatTile label="Updated" value={stats.updated} tone="emerald" />
                  <StatTile label="Expired" value={stats.expired} tone="yellow" />
                  <StatTile label="For Updating" value={stats.forUpdating} tone="amber" />
                  <StatTile label="No CLUP" value={stats.noClup} tone="red" />
                </div>
              </div>
            </>
          )}

          {activeMapMode === "clup-progress" && (
            <>
              <div className="xl:col-span-8 rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
                  <h3 className="text-sm font-black uppercase tracking-wider">Current CLUP Progress</h3>
                </div>
                <div className="overflow-x-auto p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <th className="py-2 px-2">Province</th>
                        <th className="py-2 px-2">City/Municipality</th>
                        <th className="py-2 px-2">Current Phase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clupProgressTableData.slice(0, 8).map((row) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="py-2 px-2">{row.province}</td>
                          <td className="py-2 px-2 font-semibold">{row.cityMunicipality}</td>
                          <td className="py-2 px-2">{row.currentProgress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="xl:col-span-4 space-y-6">
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    <h3 className="text-sm font-black uppercase tracking-wider">CLUP Progress Snapshot</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    <StatTile label="Prephase" value={clupProgressSummary.prephase} tone="yellow" />
                    <StatTile label="CLUP Formulation" value={clupProgressSummary.formulation} tone="amber" />
                    <StatTile label="Review & Approval" value={clupProgressSummary.reviewApproval} tone="emerald" />
                    <StatTile label="Not Determined" value={clupProgressSummary.notDetermined} tone="red" />
                  </div>
                </div>

                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider">LGU Type</h3>
                  </div>
                  <div className="p-4">
                    <ResponsiveContainer width="100%" height={190}>
                      <BarChart data={lguTypeBarData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="type" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMapMode === "pdpfp" && (
            <>
              <div className="xl:col-span-8 rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
                  <h3 className="text-sm font-black uppercase tracking-wider">Breakdown of Status</h3>
                </div>
                <div className="overflow-x-auto p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <th className="py-2 px-2">Province</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Year Approved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdpfpTableData.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="py-2 px-2 font-semibold">{row.province}</td>
                          <td className="py-2 px-2">{row.status}</td>
                          <td className="py-2 px-2">{row.yearApproved ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="xl:col-span-4 space-y-6">
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    <h3 className="text-sm font-black uppercase tracking-wider">PDPFP Status Snapshot</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    <StatTile label="Approved" value={pdpfpSummary.approved} tone="emerald" />
                    <StatTile label="Adopted" value={pdpfpSummary.adopted} tone="yellow" />
                    <StatTile label="For Updating" value={pdpfpSummary.forUpdating} tone="amber" />
                    <StatTile label="No PDPFP" value={pdpfpSummary.noPlan} tone="red" />
                  </div>
                </div>

                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider">Provincial Income Class</h3>
                  </div>
                  <div className="p-4">
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie data={provincialIncomeClassData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={66} label>
                          {provincialIncomeClassData.map((entry, index) => (
                            <Cell key={`income-${entry.name}-${index}`} fill={["#3b82f6", "#1e40af", "#f97316", "#7e22ce", "#ec4899"][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <TableProperties className="h-4 w-4 text-[#003087]" />
            <h3 className="text-base md:text-lg font-black text-slate-800">
              {activeMapMode === "clup" && "CLUP LGU Directory"}
              {activeMapMode === "clup-progress" && "CLUP Progress Data Table"}
              {activeMapMode === "pdpfp" && "PDPFP Provincial Data Table"}
            </h3>
          </div>

          {activeMapMode === "clup" && (
            <CityMunicipalityTable
              data={directoryTableData}
              onView={(item) => openRecordDetail(item.cityMunicipality, item as unknown as Record<string, unknown>)}
              onEdit={(item) => handleViewLguByCity(item.cityMunicipality)}
              onArchive={(item) => {
                void handleArchiveByCityProvince(item.cityMunicipality, item.province);
              }}
              onAdd={() => window.alert("Use Compliance Monitoring or LGU Directory pages for full editing workflows.")}
              onImport={importLgus}
            />
          )}

          {activeMapMode === "clup-progress" && (
            <ClupPdpfpTable
              data={clupProgressTableData}
              onView={(item) => openRecordDetail(item.cityMunicipality, item as unknown as Record<string, unknown>)}
              onEdit={(item) => handleViewLguById(item.id)}
              onArchive={(item) => {
                void handleArchiveByCityProvince(item.cityMunicipality, item.province);
              }}
              onImport={importLgus}
            />
          )}

          {activeMapMode === "pdpfp" && (
            <PdpfpTable
              data={pdpfpTableData}
              onView={(item) => openRecordDetail(item.province, item as unknown as Record<string, unknown>)}
              onEdit={(item) => window.alert(`Edit flow is not enabled yet for ${item.province}.`)}
              onArchive={(item) => {
                void handleArchiveProvinceRecords(item.province);
              }}
              onImport={importLgus}
            />
          )}
        </section>
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

      <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />
    </div>
  );
}

// Filter section helper component
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider px-4 py-2.5">
        {label}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function MapModeButton({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl px-4 py-3 border transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white border-blue-900 shadow-lg"
          : "bg-white text-slate-700 border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      <div className="inline-flex items-center gap-2 text-sm font-black">
        {icon}
        {title}
      </div>
      <p className={`text-xs mt-1 ${active ? "text-blue-100" : "text-slate-500"}`}>{subtitle}</p>
    </button>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red" | "yellow";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  } as const;

  return (
    <div className={`rounded-2xl border px-3 py-3 text-center ${tones[tone]}`}>
      <p className="text-2xl font-black leading-none">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
