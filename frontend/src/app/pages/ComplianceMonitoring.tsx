import { useEffect, useMemo, useState } from "react";
import ClupPdpfpTable, { ClupPdpfpStatus } from "../components/ClupPdpfpTable";
import { useLgus } from "../LGUContext";
import { LoadingState } from "../components/LoadingState";
import { LGUDirectory } from "../types/schema";
import { LGUDetailModal } from "../components/LGUDetailModal";
import { PageShell } from "../components/PageShell";
import { type AnnexClupRow } from "../data/annexData";
import { fetchAnnexRows } from "../utils/annexApi";

const normalizeName = (value: string) =>
  value
    .replace(/^city\s+of\s+/i, "")
    .replace(/\s+city$/i, "")
    .trim()
    .toLowerCase();

export function ComplianceMonitoring() {
  const { lgus, isLoading, archiveLgu, importLgus } = useLgus();
  const [selectedLgu, setSelectedLgu] = useState<LGUDirectory | null>(null);
  const [annexRows, setAnnexRows] = useState<AnnexClupRow[]>([]);
  const [annexLoading, setAnnexLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRows = async () => {
      setAnnexLoading(true);
      const rows = await fetchAnnexRows<AnnexClupRow>("annex-clup-status");
      if (!active) return;
      setAnnexRows(rows || []);
      setAnnexLoading(false);
    };

    void loadRows();

    return () => {
      active = false;
    };
  }, []);

  // Map backend LGUs to the detailed table interface
  const tableData = useMemo((): ClupPdpfpStatus[] => {
    return annexRows.map((row) => ({
      id: `${row.province}|${row.cityMunicipality}`,
      cityMunicipality: row.cityMunicipality,
      province: row.province,
      planningStartYear: row.planningStartYear ?? null,
      planningEndYear: row.planningEndYear ?? null,
      resolutionNumber: row.resolutionNumber ?? null,
      clupStatus: row.clupStatus || "Not Determined",
      prePhase: Number(row.prePhase ?? 0),
      phase1: Number(row.phase1 ?? 0),
      phase2: Number(row.phase2 ?? 0),
      phase3: Number(row.phase3 ?? 0),
      phase4: Number(row.phase4 ?? 0),
      phase5: Number(row.phase5 ?? 0),
      currentProgress: row.currentProgress || "None Indicated",
    }));
  }, [annexRows]);

  if (isLoading || annexLoading) return <LoadingState />;

  const handleView = (item: ClupPdpfpStatus) => {
    const lgu = lgus.find(
      (l) =>
        l.province === item.province &&
        normalizeName(l.city_municipality) === normalizeName(item.cityMunicipality),
    );
    if (lgu) setSelectedLgu(lgu);
    else window.alert(`No detailed LGU profile found for ${item.cityMunicipality}.`);
  };

  const handleArchive = async (item: ClupPdpfpStatus) => {
    const lgu = lgus.find(
      (l) =>
        l.province === item.province &&
        normalizeName(l.city_municipality) === normalizeName(item.cityMunicipality),
    );
    if (!lgu) {
      window.alert(`Unable to archive ${item.cityMunicipality}: LGU record not found.`);
      return;
    }

    if (window.confirm(`Archive ${item.cityMunicipality}?`)) {
      await archiveLgu(lgu.id);
    }
  };

  return (
    <>
      <PageShell
        title="Compliance Monitoring"
        subtitle="CLUP and PDPFP compliance tracking across Negros Island Region"
      >
        <div className="space-y-6">

          <ClupPdpfpTable 
            data={tableData}
            onView={handleView}
            onEdit={handleView}
            onArchive={(item) => {
              void handleArchive(item);
            }}
            onAdd={() => alert("Please add new LGUs via the LGU Directory")}
            onImport={importLgus}
          />
        </div>

        <LGUDetailModal lgu={selectedLgu} onClose={() => setSelectedLgu(null)} />
      </PageShell>
    </>
  );
}
