import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import { provinces, computeStats } from "../utils/clup-data";
import { useData } from "../DataContext";
import { NegrosIslandMap } from "../components/NegrosIslandMap";

export function Dashboard() {
  const { municipalities: nirMunicipalities } = useData();
  // Filters
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [yearApprovalRange, setYearApprovalRange] = useState<[number, number]>([1900, 2026]);
  const [endYearRange, setEndYearRange] = useState<[number, number]>([0, 2050]);

  // Filter municipalities
  const filteredMunicipalities = useMemo(() => {
    return nirMunicipalities.filter((m) => {
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
  }, [selectedProvince, selectedCity, selectedStatus, yearApprovalRange, endYearRange]);

  const stats = computeStats(filteredMunicipalities);
  const allStats = computeStats(nirMunicipalities);

  // Cities for dropdown (filtered by province)
  const availableCities = useMemo(() => {
    if (selectedProvince === "All") return nirMunicipalities.map((m) => m.name);
    return nirMunicipalities.filter((m) => m.province === selectedProvince).map((m) => m.name);
  }, [selectedProvince]);

  // Reset filters
  const resetFilters = () => {
    setSelectedProvince("All");
    setSelectedCity("All");
    setSelectedStatus("All");
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
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Banner */}
      <div className="bg-[#003087] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  ENVIRONMENTAL AND LAND USE PLANNING AND DEVELOPMENT (ELUPD)
                </h1>
                <p className="text-sm md:text-base font-semibold text-blue-200">
                  CLUP AND PDPFP STATUS DASHBOARD — Negros Island Region
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-yellow-300 font-semibold text-sm">
                As of March 12, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT COLUMN - Status Cards */}
          <div className="lg:col-span-2 space-y-3">
            {/* Updated */}
            <div className="bg-green-500 rounded-lg p-4 text-center text-white shadow-md">
              <div className="text-5xl font-bold">{stats.updated}</div>
              <div className="text-sm font-semibold mt-1">Updated</div>
            </div>
            {/* Expired */}
            <div className="bg-yellow-500 rounded-lg p-4 text-center text-white shadow-md">
              <div className="text-5xl font-bold">{stats.expired}</div>
              <div className="text-sm font-semibold mt-1">Expired (2025)</div>
            </div>
            {/* For Updating */}
            <div className="bg-orange-500 rounded-lg p-4 text-center text-white shadow-md">
              <div className="text-5xl font-bold">{stats.forUpdating}</div>
              <div className="text-sm font-semibold mt-1">For Updating</div>
            </div>
            {/* No CLUP */}
            <div className="bg-red-600 rounded-lg p-4 text-center text-white shadow-md">
              <div className="text-5xl font-bold">{stats.noClup}</div>
              <div className="text-sm font-semibold mt-1">No CLUP</div>
            </div>
          </div>

          {/* CENTER - Map */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-blue-800">
              <div className="bg-blue-800 text-white text-center py-2 px-4">
                <h3 className="font-semibold text-sm">CLUP Status Map</h3>
              </div>
              {/* Map Legend */}
              <div className="flex items-center justify-center gap-4 py-2 bg-gray-50 border-b text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                  <span>For Updating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span>No CLUP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span>Updated</span>
                </div>
              </div>
              <div className="p-2">
                <NegrosIslandMap municipalities={filteredMunicipalities} />
              </div>
            </div>
          </div>

          {/* RIGHT - Filters */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border-2 border-blue-800">
              {/* Province */}
              <FilterSection label="Province">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity("All");
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white"
                >
                  <option value="All">All</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FilterSection>

              {/* City/Municipality */}
              <FilterSection label="City/Municipality">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white"
                >
                  <option value="All">All</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FilterSection>

              {/* CLUP Status */}
              <FilterSection label="CLUP Status">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white"
                >
                  <option value="All">All</option>
                  <option value="updated">Updated</option>
                  <option value="for-updating">For Updating</option>
                  <option value="no-clup">No CLUP</option>
                  <option value="expired">Expired</option>
                </select>
              </FilterSection>

              {/* Year of Approval */}
              <FilterSection label="Year of Approval">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={yearApprovalRange[0]}
                    onChange={(e) => setYearApprovalRange([Number(e.target.value), yearApprovalRange[1]])}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    min={1900}
                    max={2030}
                  />
                  <input
                    type="number"
                    value={yearApprovalRange[1]}
                    onChange={(e) => setYearApprovalRange([yearApprovalRange[0], Number(e.target.value)])}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    min={1900}
                    max={2030}
                  />
                </div>
              </FilterSection>

              {/* End Year */}
              <FilterSection label="End Year">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={endYearRange[0]}
                    onChange={(e) => setEndYearRange([Number(e.target.value), endYearRange[1]])}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    min={0}
                    max={2060}
                  />
                  <input
                    type="number"
                    value={endYearRange[1]}
                    onChange={(e) => setEndYearRange([endYearRange[0], Number(e.target.value)])}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    min={0}
                    max={2060}
                  />
                </div>
              </FilterSection>

              {/* Reset */}
              <div className="p-3 border-t">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* FAR RIGHT - Pie Charts */}
          <div className="lg:col-span-3 space-y-4">
            {/* Risk Informed Plans */}
            <div className="bg-white rounded-lg shadow-md border-2 border-blue-800 overflow-hidden">
              <div className="bg-blue-800 text-white text-center py-2 px-4">
                <h3 className="font-semibold text-sm">Risk Informed Plans</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${value} (${name === 'Yes' ? riskPct : noRiskPct}%)`}
                      labelLine={true}
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`risk-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-xs">
                  <span className="text-center">
                    <span className="font-bold text-lg text-green-600">{stats.riskInformed}</span>
                    <br />
                    <span className="text-gray-600">Risk Informed</span>
                  </span>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      <span>Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span>No</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Local Shelter Plan */}
            <div className="bg-white rounded-lg shadow-md border-2 border-blue-800 overflow-hidden">
              <div className="bg-blue-800 text-white text-center py-2 px-4">
                <h3 className="font-semibold text-sm">With Integrated Local Shelter Plan</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={shelterPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${value} (${name === 'Yes' ? shelterPct : noShelterPct}%)`}
                      labelLine={true}
                    >
                      {shelterPieData.map((entry, index) => (
                        <Cell key={`shelter-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-xs">
                  <span className="text-center">
                    <span className="font-bold text-lg text-green-600">{stats.integrated}</span>
                    <br />
                    <span className="text-gray-600">Integrated</span>
                  </span>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      <span>Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span>No</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
            Updated {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter section helper component
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b last:border-b-0">
      <div className="bg-blue-800 text-white text-xs font-semibold px-3 py-1.5">
        {label}
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}
