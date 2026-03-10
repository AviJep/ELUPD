import { useMemo } from "react";
import {
  Activity,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/EmptyState";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useApiData } from "../contexts/ApiDataContext";

export function Dashboard() {
  const {
    isLoading,
    provinces,
    municipalities,
    complianceRecords,
    systemLogs,
  } = useApiData();

  const monthLabels = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
    });
  }, []);

  const lineChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    monthLabels.forEach((m) => (counts[m] = 0));

    complianceRecords.forEach((record) => {
      if (!record.reportDate) return;
      const date = new Date(record.reportDate);
      const label = date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
      if (label in counts) counts[label] += 1;
    });

    return monthLabels.map((month) => ({ month, updates: counts[month] || 0 }));
  }, [complianceRecords, monthLabels]);

  const heatmapData = useMemo(() => {
    const lastThreeMonths = monthLabels.slice(-3);
    const counts: Record<string, Record<string, number>> = {};

    complianceRecords.forEach((record) => {
      const municipality = (record.municipality ?? "Unknown").toString();
      const date = record.reportDate ? new Date(record.reportDate) : null;
      const monthLabel = date
        ? date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
        : null;

      if (!monthLabel || !lastThreeMonths.includes(monthLabel)) return;

      counts[municipality] = counts[municipality] ?? { [lastThreeMonths[0]]: 0, [lastThreeMonths[1]]: 0, [lastThreeMonths[2]]: 0 };
      counts[municipality][monthLabel] += 1;
    });

    return Object.entries(counts)
      .slice(0, 5)
      .map(([municipality, data]) => ({
        barangay: municipality,
        jan: Math.min(100, data[lastThreeMonths[0]] ?? 0),
        feb: Math.min(100, data[lastThreeMonths[1]] ?? 0),
        mar: Math.min(100, data[lastThreeMonths[2]] ?? 0),
      }));
  }, [complianceRecords, monthLabels]);

  const recentActivities = useMemo(() => {
    return [...systemLogs]
      .sort((a, b) => {
        const aTime = new Date(a.timestamp ?? 0).getTime();
        const bTime = new Date(b.timestamp ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((log) => ({
        location: log.module ?? "Unknown",
        action: log.action ?? "",
        time: log.timestamp ?? "",
      }));
  }, [systemLogs]);

  const statsData = useMemo(() => {
    const updated = complianceRecords.filter((r) => r.status === "compliant").length;
    const nonCompliant = complianceRecords.filter((r) => r.status === "non-compliant").length;
    const expired = complianceRecords.filter((r) => r.status === "expired").length;

    return {
      activeCities: municipalities.length,
      totalMunicipalities: municipalities.length,
      compliant: updated,
      nonCompliant,
      expired,
      updating: complianceRecords.filter((r) => r.status === "updating").length,
    };
  }, [municipalities.length, complianceRecords]);

  const alertStats = useMemo(() => {
    return {
      criticalNonCompliance: complianceRecords.filter((r) => r.status === "non-compliant").length,
      pendingUpdates: statsData.updating,
      expiredRecords: statsData.expired,
    };
  }, [complianceRecords, statsData.updating, statsData.expired]);

  const barChartData = useMemo(() => {
    if (!provinces.length || !municipalities.length) return [];

    return provinces.map((province) => {
      const provinceMunicipalities = municipalities.filter((m) => m.province === province.name);
      return {
        province: province.name,
        updated: provinceMunicipalities.filter((m) => m.status === "updated").length,
        updating: provinceMunicipalities.filter((m) => m.status === "updating").length,
        nonCompliant: provinceMunicipalities.filter((m) => m.status === "non-compliance").length,
        expired: provinceMunicipalities.filter((m) => m.status === "expired").length,
      };
    });
  }, [provinces, municipalities]);

  const pieChartData = useMemo(() => {
    return [
      { name: "Updated", value: statsData.compliant, color: "#10b981" },
      { name: "Updating", value: statsData.updating, color: "#f59e0b" },
      { name: "Non-Compliant", value: statsData.nonCompliant, color: "#ef4444" },
      { name: "Expired", value: statsData.expired, color: "#6b7280" },
    ];
  }, [statsData]);

  const hasData = provinces.length > 0 || municipalities.length > 0 || complianceRecords.length > 0;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time CLUP / PDPFPD monitoring across Negros Island Region
        </p>
      </div>

      {isLoading ? (
        <EmptyState
          title="Loading dashboard..."
          message="Fetching data from the database."
        />
      ) : !hasData ? (
        <EmptyState
          title="No data yet"
          message="Once your database has records, the dashboard metrics will appear here."
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Cities
                </CardTitle>
                <Activity className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{statsData.activeCities}</div>
                <p className="text-xs text-gray-500 mt-1">Real-time updates</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Municipalities
                </CardTitle>
                <MapPin className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{statsData.totalMunicipalities}</div>
                <p className="text-xs text-gray-500 mt-1">Across all provinces</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Compliant Areas
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{statsData.compliant}</div>
                <p className="text-xs text-gray-500 mt-1">Compliance breakdown</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Non-Compliant
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{statsData.nonCompliant}</div>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Expired Records
                </CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{statsData.expired}</div>
                <p className="text-xs text-gray-500 mt-1">Requires update</p>
              </CardContent>
            </Card>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-50 border-red-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-700">{alertStats.criticalNonCompliance}</div>
                <div className="text-sm text-red-600 mt-1">Critical Non-Compliance</div>
                <div className="text-xs text-red-500 mt-2">Requires immediate action</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-700">{alertStats.pendingUpdates}</div>
                <div className="text-sm text-orange-600 mt-1">Pending Updates</div>
                <div className="text-xs text-orange-500 mt-2">In progress</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-700">{alertStats.expiredRecords}</div>
                <div className="text-sm text-gray-600 mt-1">Expired Records</div>
                <div className="text-xs text-gray-500 mt-2">Needs renewal</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Provincial Compliance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="province" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="updated" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="updating" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonCompliant" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expired" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Barangay Update Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="updates"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Compliance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Heatmap */}
            <Card className="bg-white shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Compliance Activity Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {heatmapData.map((item) => (
                    <div key={item.barangay}>
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {item.barangay}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded" style={{ backgroundColor: `rgba(34, 197, 94, ${item.jan / 100})` }}>
                          <div className="text-xs font-medium">Jan: {item.jan}%</div>
                        </div>
                        <div className="text-center p-2 rounded" style={{ backgroundColor: `rgba(34, 197, 94, ${item.feb / 100})` }}>
                          <div className="text-xs font-medium">Feb: {item.feb}%</div>
                        </div>
                        <div className="text-center p-2 rounded" style={{ backgroundColor: `rgba(34, 197, 94, ${item.mar / 100})` }}>
                          <div className="text-xs font-medium">Mar: {item.mar}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Recent Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {activity.location}
                      </div>
                      <div className="text-sm text-gray-600">{activity.action}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
