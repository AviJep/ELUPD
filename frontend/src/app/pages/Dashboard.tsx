import {
  Activity,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const statsData = {
  activeCities: 42,
  totalMunicipalities: 62,
  compliant: 48,
  nonCompliant: 12,
  expired: 2,
};

const barChartData = [
  { province: "Negros Occidental", updated: 28, updating: 8, nonCompliant: 6, expired: 1 },
  { province: "Negros Oriental", updated: 18, updating: 4, nonCompliant: 5, expired: 1 },
  { province: "Siquijor", updated: 5, updating: 1, nonCompliant: 1, expired: 0 },
];

const lineChartData = [
  { month: "Oct", updates: 45 },
  { month: "Nov", updates: 52 },
  { month: "Dec", updates: 48 },
  { month: "Jan", updates: 61 },
  { month: "Feb", updates: 58 },
  { month: "Mar", updates: 62 },
];

const pieChartData = [
  { name: "Updated", value: 48, color: "#10b981" },
  { name: "Updating", value: 12, color: "#f59e0b" },
  { name: "Non-Compliant", value: 8, color: "#ef4444" },
  { name: "Expired", value: 2, color: "#6b7280" },
];

const heatmapData = [
  { barangay: "Bacolod City", jan: 95, feb: 92, mar: 98 },
  { barangay: "Dumaguete City", jan: 88, feb: 90, mar: 94 },
  { barangay: "Silay City", jan: 85, feb: 88, mar: 91 },
  { barangay: "Talisay City", jan: 78, feb: 82, mar: 86 },
  { barangay: "Victorias City", jan: 90, feb: 92, mar: 95 },
];

const recentActivities = [
  { location: "Bacolod City", action: "Status updated to Compliant", time: "2 hours ago" },
  { location: "Dumaguete City", action: "Barangay data imported", time: "5 hours ago" },
  { location: "Silay City", action: "Compliance report generated", time: "1 day ago" },
  { location: "Siquijor", action: "New barangay added", time: "2 days ago" },
  { location: "Talisay City", action: "Status marked as Updating", time: "3 days ago" },
];

export function Dashboard() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time compliance monitoring across Negros Island Region
        </p>
      </div>

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
            <p className="text-xs text-gray-500 mt-1">Across 3 provinces</p>
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
            <p className="text-xs text-gray-500 mt-1">77% compliance rate</p>
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
    </div>
  );
}
