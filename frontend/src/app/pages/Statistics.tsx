import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLgus } from "../LGUContext";

const provinces = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];

export function Statistics() {
  const { lgus, isLoading } = useLgus();

  const stats = useMemo(() => {
    const total = lgus.length;
    const updated = lgus.filter(l => l.clup_progress?.clup_status === "Review & Approval").length;
    const forUpdating = lgus.filter(l => l.clup_progress?.clup_status === "CLUP Formulation").length;
    const noClup = lgus.filter(l => l.clup_progress?.clup_status === "Prephase").length;
    const expired = lgus.filter(l => l.clup_progress?.clup_status === "Not Determined").length;

    return { total, updated, forUpdating, noClup, expired };
  }, [lgus]);

  // Province breakdown — computed from live data
  const provinceComparison = useMemo(
    () =>
      provinces.map((prov) => {
        const group = lgus.filter((m) => m.province === prov);
        return {
          province: prov,
          municipalities: group.length,
          updated: group.filter((m) => m.clup_progress?.clup_status === "Review & Approval").length,
          forUpdating: group.filter((m) => m.clup_progress?.clup_status === "CLUP Formulation").length,
          noClup: group.filter((m) => m.clup_progress?.clup_status === "Prephase").length,
          expired: group.filter((m) => m.clup_progress?.clup_status === "Not Determined").length,
        };
      }),
    [lgus],
  );

  // Overall compliance rate pie
  const complianceRate = useMemo(() => {
    const total = lgus.length || 1;
    return [
      { name: "Updated", value: Math.round((stats.updated / total) * 100), color: "#10b981" },
      { name: "For Updating", value: Math.round((stats.forUpdating / total) * 100), color: "#f59e0b" },
      { name: "No CLUP", value: Math.round((stats.noClup / total) * 100), color: "#ef4444" },
      { name: "Expired", value: Math.round((stats.expired / total) * 100), color: "#6b7280" },
    ];
  }, [stats, lgus.length]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#003087] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Analyzing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Blue Header Banner */}
      <div className="bg-[#003087] text-white rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                  Statistics and Analytics
                </h1>
                <p className="text-sm font-semibold text-blue-200">
                  Detailed compliance analytics and regional trends
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-yellow-300 font-black text-sm uppercase tracking-widest">
                Real-Time Data
              </p>
              <p className="text-[10px] text-blue-200 font-bold uppercase mt-1">DHSUD NIR ELUPD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatSummaryCard title="Total LGUs" value={stats.total} color="bg-blue-600" />
          <StatSummaryCard title="Updated" value={stats.updated} color="bg-green-600" />
          <StatSummaryCard title="For Updating" value={stats.forUpdating} color="bg-amber-600" />
          <StatSummaryCard title="No CLUP" value={stats.noClup} color="bg-red-600" />
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
              <CardTitle className="text-xs font-black text-[#003087] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#003087]" />
                Provincial Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={provinceComparison}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="province" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                  <Bar dataKey="updated" name="Updated" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="forUpdating" name="For Updating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="noClup" name="No CLUP" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expired" name="Expired" fill="#64748b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
              <CardTitle className="text-xs font-black text-[#003087] uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#003087]" />
                Overall CLUP Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={complianceRate}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complianceRate.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                {complianceRate.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#003087]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatSummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white group hover:scale-[1.02] transition-transform duration-300">
      <div className={`h-1.5 ${color}`} />
      <CardContent className="pt-6 pb-6 text-center">
        <div className="text-4xl font-black text-gray-900 leading-none mb-2">{value}</div>
        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest group-hover:text-[#003087] transition-colors">{title}</p>
      </CardContent>
    </Card>
  );
}

import { BarChart3 } from "lucide-react";
