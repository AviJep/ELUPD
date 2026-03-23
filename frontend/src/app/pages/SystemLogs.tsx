import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Download, RefreshCw, ScrollText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useLgus } from "../LGUContext";

const statusConfig = {
  success: { label: "Success", color: "bg-green-100 text-green-800" },
  warning: { label: "Warning", color: "bg-orange-100 text-orange-800" },
  error: { label: "Error", color: "bg-red-100 text-red-800" },
  info: { label: "Info", color: "bg-blue-100 text-blue-800" },
};

export function SystemLogs() {
  const { logs, isLoading } = useLgus();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all-modules");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const filtered = useMemo(() => {
    let list = logs;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.module.toLowerCase().includes(q),
      );
    }
    if (moduleFilter !== "all-modules") {
      list = list.filter((l) => l.module.toLowerCase().includes(moduleFilter));
    }
    if (statusFilter !== "all-status") {
      list = list.filter((l) => l.status === statusFilter);
    }
    return list;
  }, [logs, search, moduleFilter, statusFilter]);

  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.status === "success").length;
  const warningCount = logs.filter((l) => l.status === "warning").length;
  const errorCount = logs.filter((l) => l.status === "error").length;

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 border-4 border-[#003087] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="bg-[#003087] text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <ScrollText className="h-6 w-6 text-blue-200" />
              <h1 className="text-2xl font-black uppercase tracking-tight">System Logs</h1>
            </div>
            <p className="text-blue-100 text-sm font-medium">Monitoring regional system activities and administrative actions</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <ScrollText className="h-64 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LogStatCard label="Total Activities" value={totalLogs} color="text-blue-600" />
          <LogStatCard label="Success" value={successCount} color="text-green-600" />
          <LogStatCard label="Warnings" value={warningCount} color="text-orange-600" />
          <LogStatCard label="Errors" value={errorCount} color="text-red-600" />
        </div>

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search action, user, or details..."
                className="pl-9 bg-white border-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                value={moduleFilter} 
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#003087]"
              >
                <option value="all-modules">All Modules</option>
                <option value="compliance">Compliance</option>
                <option value="core">Core</option>
              </select>
              <Button variant="outline" className="border-gray-200" onClick={() => { setSearch(""); setModuleFilter("all-modules"); }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Action</th>
                    <th className="py-4 px-6">Module</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400 text-sm font-medium">No activity logs found.</td>
                    </tr>
                  ) : (
                    filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6 text-[11px] font-bold text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-black text-gray-700">{log.user}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-[#003087]">{log.action}</span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="text-[9px] uppercase font-black border-gray-200 text-gray-400">
                            {log.module}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={`text-[9px] uppercase font-black border-none ${statusConfig[log.status as keyof typeof statusConfig]?.color ?? ""}`}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs">{log.details}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LogStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="pt-6 text-center">
        <div className={`text-3xl font-black ${color}`}>{value}</div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
