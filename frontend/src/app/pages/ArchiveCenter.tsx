import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, RotateCcw, Trash2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const archivedRecords = [
  { id: 1, municipality: "Bacolod City", province: "Negros Occidental", records: 45, archivedDate: "2025-12-15", reason: "Data migration" },
  { id: 2, municipality: "Silay City", province: "Negros Occidental", records: 28, archivedDate: "2025-11-20", reason: "System update" },
  { id: 3, municipality: "Dumaguete City", province: "Negros Oriental", records: 32, archivedDate: "2025-10-10", reason: "Record consolidation" },
  { id: 4, municipality: "Cadiz City", province: "Negros Occidental", records: 19, archivedDate: "2025-09-05", reason: "Expired records" },
  { id: 5, municipality: "Siquijor", province: "Siquijor", records: 15, archivedDate: "2025-08-12", reason: "Manual archive" },
  { id: 6, municipality: "Talisay City", province: "Negros Occidental", records: 22, archivedDate: "2025-07-28", reason: "Data cleanup" },
];

export function ArchiveCenter() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Archive Center</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage archived compliance records and historical data
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">186</div>
            <div className="text-sm text-gray-600 mt-1">Total Archives</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">2.4 GB</div>
            <div className="text-sm text-gray-600 mt-1">Storage Used</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600 mt-1">Restored This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">45 days</div>
            <div className="text-sm text-gray-600 mt-1">Retention Period</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search archives..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                <SelectItem value="negros-occidental">Negros Occidental</SelectItem>
                <SelectItem value="negros-oriental">Negros Oriental</SelectItem>
                <SelectItem value="siquijor">Siquijor</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Archived Records Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Archived Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Municipality
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Province
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Records Count
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Archived Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {archivedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {record.municipality}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {record.province}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {record.records} records
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {record.archivedDate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        {record.reason}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Archive Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Archive Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Restored", item: "Bacolod City records", date: "2026-03-02", user: "Admin" },
                { action: "Archived", item: "Cadiz City outdated data", date: "2026-02-28", user: "System" },
                { action: "Deleted", item: "Old migration files", date: "2026-02-25", user: "Admin" },
                { action: "Restored", item: "Dumaguete City backup", date: "2026-02-20", user: "Admin" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.action}: {activity.item}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.date} • by {activity.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Storage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { province: "Negros Occidental", size: "1.2 GB", percentage: 50 },
                { province: "Negros Oriental", size: "0.8 GB", percentage: 33 },
                { province: "Siquijor", size: "0.4 GB", percentage: 17 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {item.province}
                    </span>
                    <span className="text-sm text-gray-600">{item.size}</span>
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
