import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthlyTrends = [
  { month: "Sep", compliant: 42, nonCompliant: 18, expired: 2 },
  { month: "Oct", compliant: 45, nonCompliant: 15, expired: 2 },
  { month: "Nov", compliant: 47, nonCompliant: 13, expired: 2 },
  { month: "Dec", compliant: 46, nonCompliant: 14, expired: 2 },
  { month: "Jan", compliant: 49, nonCompliant: 11, expired: 2 },
  { month: "Feb", compliant: 48, nonCompliant: 12, expired: 2 },
  { month: "Mar", compliant: 51, nonCompliant: 9, expired: 2 },
];

const provinceComparison = [
  { province: "Negros Occidental", municipalities: 43, compliant: 35, nonCompliant: 7, expired: 1 },
  { province: "Negros Oriental", municipalities: 19, compliant: 14, nonCompliant: 4, expired: 1 },
  { province: "Siquijor", municipalities: 6, compliant: 5, nonCompliant: 1, expired: 0 },
];

const complianceRate = [
  { name: "Compliant", value: 77, color: "#10b981" },
  { name: "Non-Compliant", value: 19, color: "#ef4444" },
  { name: "Expired", value: 4, color: "#6b7280" },
];

const updateFrequency = [
  { day: "Mon", updates: 12 },
  { day: "Tue", updates: 15 },
  { day: "Wed", updates: 18 },
  { day: "Thu", updates: 14 },
  { day: "Fri", updates: 20 },
  { day: "Sat", updates: 8 },
  { day: "Sun", updates: 5 },
];

export function Statistics() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Statistics and Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Detailed compliance analytics and trends
        </p>
      </div>

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
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="compliant"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="nonCompliant"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="expired"
                  stackId="1"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">77%</div>
            <div className="text-sm opacity-90 mt-1">Compliance Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">62</div>
            <div className="text-sm opacity-90 mt-1">Total Municipalities</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">1,847</div>
            <div className="text-sm opacity-90 mt-1">Total Barangays</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">92</div>
            <div className="text-sm opacity-90 mt-1">Updates This Week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
