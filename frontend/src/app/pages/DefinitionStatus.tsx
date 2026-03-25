import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import type { DefinitionStatusRow } from "../data/annexData";
import { fetchAnnexRows } from "../utils/annexApi";

type DefinitionStatusApiRow = {
  className?: string | null;
  subclass?: string | null;
  definition?: string | null;
  meansOfVerification?: string | null;
};

export function DefinitionStatus() {
  const [rows, setRows] = useState<DefinitionStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDefinitionRows = async () => {
      setLoading(true);
      setError(null);

      const apiRows = await fetchAnnexRows<DefinitionStatusApiRow>("definition-status");
      if (!active) return;
      if (!apiRows) {
        setError("Unable to load definition status rows from Django API.");
        setLoading(false);
        return;
      }

      const mapped: DefinitionStatusRow[] = apiRows.map((row) => ({
        class: row.className ?? null,
        subclass: row.subclass ?? null,
        definition: row.definition ?? null,
        meansOfVerification: row.meansOfVerification ?? null,
      }));

      setRows(mapped);
      setLoading(false);
    };

    void loadDefinitionRows();

    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(
    () =>
      rows.reduce<Record<string, DefinitionStatusRow[]>>((acc, row) => {
        const key = row.class || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {}),
    [rows],
  );

  return (
    <PageShell
      title="Definition Status"
      subtitle="Reference definitions for planning status categories"
    >
      <section className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#003087] to-[#0a4aa3] text-white">
          <h2 className="text-sm font-black uppercase tracking-wider">Status Definitions</h2>
        </div>
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {loading && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900">
              Loading live definition rows...
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && Object.keys(groups).length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
              No definition rows returned by the Django API.
            </div>
          )}
          {Object.entries(groups).map(([group, rows]) => (
            <div key={group} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider">
                {group}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-4">Subclass</th>
                      <th className="py-2.5 px-4">Definition</th>
                      <th className="py-2.5 px-4">Means of Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${group}-${index}`} className="border-b border-slate-100 last:border-b-0 align-top">
                        <td className="py-3 px-4 font-semibold text-slate-800 min-w-40">{row.subclass || "-"}</td>
                        <td className="py-3 px-4 text-slate-700">{row.definition || "-"}</td>
                        <td className="py-3 px-4 text-slate-600 min-w-52">{row.meansOfVerification || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
