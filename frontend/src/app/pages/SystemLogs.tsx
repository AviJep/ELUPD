import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useData } from "../DataContext";

const statusConfig = {
  success: { label: "Success", color: "bg-green-100 text-green-800" },
  warning: { label: "Warning", color: "bg-orange-100 text-orange-800" },
  error: { label: "Error", color: "bg-red-100 text-red-800" },
  info: { label: "Info", color: "bg-blue-100 text-blue-800" },
};

export function SystemLogs() {
  const { logs } = useData();
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

  // Compute user activity from logs
  const userActivity = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of logs) {
      map.set(log.user, (map.get(log.user) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([user, actions]) => ({
        user,
        actions,
        role: user === "system" ? "System" : user.includes("admin") ? "Administrator" : "Data Officer",
      }))
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 4);
  }, [logs]);

  // Compute module activity from logs
  const moduleActivity = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of logs) {
      map.set(log.module, (map.get(log.module) ?? 0) + 1);
    }
    const items = Array.from(map.entries())
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    const maxCount = items[0]?.count ?? 1;
    return items.map((i) => ({
      ...i,
      percentage: Math.round((i.count / maxCount) * 100),
    }));
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Banner */}
      <div className="bg-[#003087] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  System Logs
                </h1>
                <p className="text-sm md:text-base font-semibold text-blue-200">
                  Monitor system activities and user actions
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{totalLogs}</div>
            <div className="text-sm text-gray-600 mt-1">Total Logs</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-600 mt-1">Successful Actions</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
            <div className="text-sm text-gray-600 mt-1">Warnings</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-600 mt-1">Errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-modules">All Modules</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="statistics">Statistics</SelectItem>
                <SelectItem value="compliance">Compliance Monitoring</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setSearch(""); setModuleFilter("all-modules"); setStatusFilter("all-status"); }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Activity Logs
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({filtered.length} record{filtered.length !== 1 ? "s" : ""})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Module
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      No logs found.
                    </td>
                  </tr>
                )}
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-700 font-mono">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {log.module}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={statusConfig[log.status as keyof typeof statusConfig]?.color ?? ""}
                      >
                        {statusConfig[log.status as keyof typeof statusConfig]?.label ?? log.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Most Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.user}
                    </div>
                    <div className="text-xs text-gray-500">{item.role}</div>
                  </div>
                  <Badge variant="outline">{item.actions} actions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Module Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleActivity.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {item.module}
                    </span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
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
