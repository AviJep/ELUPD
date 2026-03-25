import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useData } from "../DataContext";
import { computeStats, provinces } from "../utils/clup-data";
import { PageShell } from "../components/PageShell";

export function Statistics() {
  const { municipalities } = useData();

  const stats = useMemo(() => computeStats(municipalities), [municipalities]);

  // Province breakdown — computed from live data
  const provinceComparison = useMemo(
    () =>
      provinces.map((prov) => {
        const group = municipalities.filter((m) => m.province === prov);
        return {
          province: prov,
          municipalities: group.length,
          updated: group.filter((m) => m.clupStatus === "updated").length,
          forUpdating: group.filter((m) => m.clupStatus === "for-updating").length,
          noClup: group.filter((m) => m.clupStatus === "no-clup").length,
          expired: group.filter((m) => m.clupStatus === "expired").length,
        };
      }),
    [municipalities],
  );

  // Overall compliance rate pie
  const complianceRate = useMemo(() => {
    const total = municipalities.length || 1;
    return [
      { name: "Updated", value: Math.round((stats.updated / total) * 100), color: "#10b981" },
      { name: "For Updating", value: Math.round((stats.forUpdating / total) * 100), color: "#f59e0b" },
      { name: "No CLUP", value: Math.round((stats.noClup / total) * 100), color: "#ef4444" },
      { name: "Expired", value: Math.round((stats.expired / total) * 100), color: "#6b7280" },
    ];
  }, [stats, municipalities.length]);

  // Risk-informed pie
  const riskPie = useMemo(
    () => [
      { name: "Risk-Informed", value: stats.riskInformed, color: "#10b981" },
      { name: "Not Risk-Informed", value: stats.notRiskInformed, color: "#ef4444" },
    ],
    [stats],
  );

  // Shelter plan pie
  const shelterPie = useMemo(
    () => [
      { name: "Integrated", value: stats.integrated, color: "#3b82f6" },
      { name: "Not Integrated", value: stats.notIntegrated, color: "#f97316" },
    ],
    [stats],
  );

  return (
    <PageShell
      title="Statistics and Analytics"
      subtitle="Detailed compliance analytics and trends"
    >

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                <Bar dataKey="updated" name="Updated" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forUpdating" name="For Updating" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="noClup" name="No CLUP" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expired" name="Expired" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Overall CLUP Status
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
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Risk-Informed CLUPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {riskPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {riskPie.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Integrated Shelter Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={shelterPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {shelterPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {shelterPie.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.updated}</div>
            <div className="text-sm opacity-90 mt-1">Updated CLUPs</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.forUpdating}</div>
            <div className="text-sm opacity-90 mt-1">For Updating</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.noClup}</div>
            <div className="text-sm opacity-90 mt-1">No CLUP</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90 mt-1">Total Municipalities</div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
