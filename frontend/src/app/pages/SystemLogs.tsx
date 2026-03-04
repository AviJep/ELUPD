import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const systemLogs = [
  { id: 1, timestamp: "2026-03-04 14:23:45", user: "admin@dhsud.gov.ph", action: "Data Export", module: "Data Import/Export", status: "success", details: "Exported 248 records to Excel" },
  { id: 2, timestamp: "2026-03-04 13:15:22", user: "officer@dhsud.gov.ph", action: "Status Update", module: "Map Intelligence", status: "success", details: "Updated Bacolod City status to Compliant" },
  { id: 3, timestamp: "2026-03-04 12:08:11", user: "admin@dhsud.gov.ph", action: "Record Archive", module: "Archive Center", status: "success", details: "Archived 45 outdated records" },
  { id: 4, timestamp: "2026-03-04 11:42:33", user: "officer@dhsud.gov.ph", action: "Barangay Added", module: "CRUD Management", status: "success", details: "Added new barangay to Dumaguete City" },
  { id: 5, timestamp: "2026-03-04 10:55:19", user: "system", action: "Data Import", module: "Data Import/Export", status: "success", details: "Imported CSV with 156 records" },
  { id: 6, timestamp: "2026-03-04 10:12:44", user: "officer@dhsud.gov.ph", action: "Login", module: "Authentication", status: "success", details: "User logged in successfully" },
  { id: 7, timestamp: "2026-03-04 09:30:28", user: "admin@dhsud.gov.ph", action: "System Backup", module: "System", status: "success", details: "Database backup completed" },
  { id: 8, timestamp: "2026-03-04 08:45:15", user: "officer@dhsud.gov.ph", action: "Report Generated", module: "Statistics", status: "success", details: "Generated monthly compliance report" },
  { id: 9, timestamp: "2026-03-03 17:22:03", user: "admin@dhsud.gov.ph", action: "Data Update", module: "Map Intelligence", status: "warning", details: "Partial update - 2 records failed validation" },
  { id: 10, timestamp: "2026-03-03 16:10:56", user: "system", action: "Auto Sync", module: "System", status: "success", details: "Synchronized map data with database" },
  { id: 11, timestamp: "2026-03-03 15:33:41", user: "officer@dhsud.gov.ph", action: "Record Delete", module: "CRUD Management", status: "success", details: "Deleted duplicate barangay entry" },
  { id: 12, timestamp: "2026-03-03 14:18:27", user: "admin@dhsud.gov.ph", action: "Permission Change", module: "User Management", status: "success", details: "Updated user permissions for officer@dhsud.gov.ph" },
];

const statusConfig = {
  success: { label: "Success", color: "bg-green-100 text-green-800" },
  warning: { label: "Warning", color: "bg-orange-100 text-orange-800" },
  error: { label: "Error", color: "bg-red-100 text-red-800" },
  info: { label: "Info", color: "bg-blue-100 text-blue-800" },
};

export function SystemLogs() {
  const [logs, setLogs] = useState(systemLogs);
  const [searchText, setSearchText] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all-modules");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.toLowerCase().includes(searchText.toLowerCase());
      const matchesModule =
        moduleFilter === "all-modules" || log.module === moduleFilter;
      const matchesStatus =
        statusFilter === "all-status" || log.status === statusFilter;
      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [logs, searchText, moduleFilter, statusFilter]);

  const exportLogs = () => {
    const header = [
      "Timestamp",
      "User",
      "Action",
      "Module",
      "Status",
      "Details",
    ];
    const csv = [header.join(",")];
    filteredLogs.forEach((l) => {
      csv.push([
        l.timestamp,
        l.user,
        l.action,
        l.module,
        l.status,
        l.details,
      ]
        .map((v) => `"${v}"`)
        .join(","));
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor system activities and user actions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">1,245</div>
            <div className="text-sm text-gray-600 mt-1">Total Logs Today</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">1,198</div>
            <div className="text-sm text-gray-600 mt-1">Successful Actions</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">42</div>
            <div className="text-sm text-gray-600 mt-1">Warnings</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">5</div>
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select
              value={moduleFilter}
              onValueChange={(v) => setModuleFilter(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-modules">All Modules</SelectItem>
                <SelectItem value="Dashboard">Dashboard</SelectItem>
                <SelectItem value="Map Intelligence">Map Intelligence</SelectItem>
                <SelectItem value="Statistics">Statistics</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Data Import/Export">Data Import/Export</SelectItem>
                <SelectItem value="CRUD Management">CRUD Management</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v)}
            >
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
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={exportLogs}
              >
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
                {filteredLogs.map((log) => (
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
                        className={statusConfig[log.status as keyof typeof statusConfig].color}
                      >
                        {statusConfig[log.status as keyof typeof statusConfig].label}
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
              {[
                { user: "admin@dhsud.gov.ph", actions: 324, role: "Administrator" },
                { user: "officer@dhsud.gov.ph", actions: 218, role: "Data Officer" },
                { user: "analyst@dhsud.gov.ph", actions: 156, role: "Analyst" },
                { user: "system", actions: 89, role: "System" },
              ].map((item, index) => (
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
              {[
                { module: "Map Intelligence", count: 456, percentage: 37 },
                { module: "CRUD Management", count: 342, percentage: 27 },
                { module: "Data Import/Export", count: 234, percentage: 19 },
                { module: "Compliance Monitoring", count: 213, percentage: 17 },
              ].map((item, index) => (
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
  );
}
