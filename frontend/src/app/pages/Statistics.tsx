import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/EmptyState";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useApiData } from "../contexts/ApiDataContext";

interface ComplianceRecord {
  id: number;
  status?: string;
  reportDate?: string;
  province?: string;
}

interface TrendPoint {
  label: string;
  compliant: number;
  nonCompliant: number;
  expired: number;
}

interface ProvinceStat {
  province: string;
  municipalities: number;
  compliant: number;
  nonCompliant: number;
  expired: number;
}

interface PieSegment {
  name: string;
  value: number;
  color: string;
}

export function Statistics() {
  const { isLoading, complianceRecords, barangays } = useApiData();

  const hasData = complianceRecords.length > 0;

  const parsedRecords = useMemo(() => {
    return complianceRecords.map((r) => ({
      ...r,
      reportDateObj: r.reportDate ? new Date(r.reportDate) : null,
    }));
  }, [complianceRecords]);

  const complianceRate = useMemo<PieSegment[]>(() => {
    const counts: Record<string, number> = {};
    parsedRecords.forEach((r) => {
      const status = (r.status ?? "").toString().toLowerCase();
      counts[status] = (counts[status] ?? 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return [
      { name: "Compliant", value: Math.round(((counts["compliant"] ?? 0) / total) * 100), color: "#10b981" },
      { name: "Updating", value: Math.round(((counts["updating"] ?? 0) / total) * 100), color: "#f59e0b" },
      { name: "Non-Compliant", value: Math.round(((counts["non-compliant"] ?? 0) / total) * 100), color: "#ef4444" },
      { name: "Expired", value: Math.round(((counts["expired"] ?? 0) / total) * 100), color: "#6b7280" },
    ];
  }, [parsedRecords]);

  const monthlyTrends = useMemo<TrendPoint[]>(() => {
    const monthly: Record<string, TrendPoint> = {};

    parsedRecords.forEach((record) => {
      if (!record.reportDateObj) return;
      const monthKey = record.reportDateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
      const existing = monthly[monthKey] ?? {
        label: monthKey,
        compliant: 0,
        nonCompliant: 0,
        expired: 0,
      };

      const status = (record.status ?? "").toString().toLowerCase();
      if (status === "compliant") existing.compliant += 1;
      else if (status === "non-compliant") existing.nonCompliant += 1;
      else if (status === "expired") existing.expired += 1;

      monthly[monthKey] = existing;
    });

    return Object.values(monthly).sort((a, b) => {
      const aDate = new Date(a.label);
      const bDate = new Date(b.label);
      return aDate.getTime() - bDate.getTime();
    });
  }, [parsedRecords]);

  const provinceComparison = useMemo<ProvinceStat[]>(() => {
    const provinces: Record<string, ProvinceStat> = {};

    parsedRecords.forEach((record) => {
      const province = (record.province ?? "Unknown").toString();
      const existing = provinces[province] ?? {
        province,
        municipalities: 0,
        compliant: 0,
        nonCompliant: 0,
        expired: 0,
      };

      existing.municipalities += 1;
      const status = (record.status ?? "").toString().toLowerCase();
      if (status === "compliant") existing.compliant += 1;
      else if (status === "non-compliant") existing.nonCompliant += 1;
      else if (status === "expired") existing.expired += 1;

      provinces[province] = existing;
    });

    return Object.values(provinces);
  }, [parsedRecords]);

  const updateFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(now);
      date.setDate(now.getDate() - idx);
      return date;
    });

    days.forEach((day) => {
      const label = day.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      counts[label] = 0;
    });

    parsedRecords.forEach((record) => {
      if (!record.reportDateObj) return;
      const label = record.reportDateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      if (label in counts) counts[label] += 1;
    });

    return days
      .map((day) => ({
        day: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        updates: counts[day.toLocaleDateString(undefined, { month: "short", day: "numeric" })] || 0,
      }))
      .reverse();
  }, [parsedRecords]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Statistics and Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Detailed compliance analytics and trends</p>
      </div>

      {isLoading ? (
        <EmptyState title="Loading statistics..." message="Fetching data from the database." />
      ) : !hasData ? (
        <EmptyState
          title="No statistics yet"
          message="Once your database has compliance records, analytics will appear here."
        />
      ) : (
        <>
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Monthly Compliance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="compliant"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="nonCompliant"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="expired"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Provincial Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={provinceComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="province" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compliant" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonCompliant" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expired" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Overall Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={complianceRate}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.value}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {complianceRate.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {complianceRate.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Weekly Update Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={updateFrequency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="updates"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards computed from data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {complianceRate.length > 0
                    ? Math.round(
                        (complianceRate[0].value /
                          (complianceRate[0].value +
                            complianceRate[1].value +
                            complianceRate[2].value)) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm opacity-90 mt-1">Compliance Rate</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {provinceComparison.reduce((sum, p) => sum + p.municipalities, 0)}
                </div>
                <div className="text-sm opacity-90 mt-1">Total Municipalities</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{barangays.length}</div>
                <div className="text-sm opacity-90 mt-1">Total Barangays</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {updateFrequency.reduce((s, u) => s + u.updates, 0)}
                </div>
                <div className="text-sm opacity-90 mt-1">Updates This Week</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
