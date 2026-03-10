import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { EmptyState } from "../components/EmptyState";
import { useApiData } from "../contexts/ApiDataContext";

const statusConfig = {
  success: { label: "Success", color: "bg-green-100 text-green-800" },
  warning: { label: "Warning", color: "bg-orange-100 text-orange-800" },
  error: { label: "Error", color: "bg-red-100 text-red-800" },
  info: { label: "Info", color: "bg-blue-100 text-blue-800" },
};

export function SystemLogs() {
  const { isLoading, systemLogs } = useApiData();
  const [searchText, setSearchText] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all-modules");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const filteredLogs = useMemo(() => {
    return systemLogs
      .filter((log) => {
        const matchesSearch =
          (log.action ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
          (log.user ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
          (log.details ?? "").toLowerCase().includes(searchText.toLowerCase());
        const matchesModule =
          moduleFilter === "all-modules" || log.module === moduleFilter;
        const matchesStatus =
          statusFilter === "all-status" || log.status === statusFilter;
        return matchesSearch && matchesModule && matchesStatus;
      })
      .sort((a, b) => {
        const aTime = new Date(a.timestamp ?? 0).getTime();
        const bTime = new Date(b.timestamp ?? 0).getTime();
        return bTime - aTime;
      });
  }, [systemLogs, searchText, moduleFilter, statusFilter]);

  const stats = useMemo(() => {
    const statusCounts = { success: 0, warning: 0, error: 0 };
    const userCounts: Record<string, number> = {};
    const moduleCounts: Record<string, number> = {};

    systemLogs.forEach((log) => {
      const status = (log.status ?? "").toLowerCase();
      if (status in statusCounts) statusCounts[status as keyof typeof statusCounts] += 1;

      const user = log.user ?? "Unknown";
      userCounts[user] = (userCounts[user] ?? 0) + 1;

      const module = log.module ?? "Unknown";
      moduleCounts[module] = (moduleCounts[module] ?? 0) + 1;
    });

    const topUsers = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([user, actions]) => ({ user, actions }));

    const moduleActivity = Object.entries(moduleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([module, count]) => ({ module, count }));

    return {
      total: systemLogs.length,
      statusCounts,
      topUsers,
      moduleActivity,
    };
  }, [systemLogs]);

  const hasData = systemLogs.length > 0;

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="Loading system logs..."
          message="Fetching logs from the database."
        />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="No logs yet"
          message="Once actions occur, they'll appear here."
          actionLabel="Refresh"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

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
      csv.push(
        [
          l.timestamp,
          l.user,
          l.action,
          l.module,
          l.status,
          l.details,
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      );
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
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Logs</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.statusCounts.success}</div>
            <div className="text-sm text-gray-600 mt-1">Successful Actions</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.statusCounts.warning}</div>
            <div className="text-sm text-gray-600 mt-1">Warnings</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.statusCounts.error}</div>
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
            {filteredLogs.length === 0 ? (
              <EmptyState
                title="No activity logs yet"
                message="Once actions occur, they'll appear here."
                actionLabel="Refresh"
                onAction={() => window.location.reload()}
              />
            ) : (
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
                          className={
                            statusConfig[log.status as keyof typeof statusConfig]?.color
                          }
                        >
                          {statusConfig[log.status as keyof typeof statusConfig]?.label || log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
              {stats.topUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No activity available.</div>
              ) : (
                stats.topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.user}
                      </div>
                      <div className="text-xs text-gray-500">Actions</div>
                    </div>
                    <Badge variant="outline">{user.actions} actions</Badge>
                  </div>
                ))
              )}
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
              {stats.moduleActivity.length === 0 ? (
                <div className="text-sm text-gray-500">No module activity yet.</div>
              ) : (
                stats.moduleActivity.map((item, index) => (
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
                        style={{ width: `${Math.min(100, (item.count / stats.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
