import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Plus, Edit, Trash2, Archive } from "lucide-react";
import { useState } from "react";

// initial datasets (could later come from an API)
const provincesData = [
  { id: 1, name: "Negros Occidental", municipalities: 43, barangays: 662, status: "active" },
  { id: 2, name: "Negros Oriental", municipalities: 19, barangays: 557, status: "active" },
  { id: 3, name: "Siquijor", municipalities: 6, barangays: 137, status: "active" },
];

const municipalitiesData = [
  { id: 1, name: "Bacolod City", province: "Negros Occidental", barangays: 61, status: "updated", lastUpdate: "2026-03-02" },
  { id: 2, name: "Dumaguete City", province: "Negros Oriental", barangays: 30, status: "updated", lastUpdate: "2026-03-03" },
  { id: 3, name: "Silay City", province: "Negros Occidental", barangays: 16, status: "updated", lastUpdate: "2026-03-01" },
  { id: 4, name: "Cadiz City", province: "Negros Occidental", barangays: 23, status: "non-compliance", lastUpdate: "2026-01-15" },
  { id: 5, name: "Siquijor", province: "Siquijor", barangays: 42, status: "updated", lastUpdate: "2026-03-01" },
  { id: 6, name: "Talisay City", province: "Negros Occidental", barangays: 14, status: "updating", lastUpdate: "2026-02-28" },
  { id: 7, name: "Bais City", province: "Negros Oriental", barangays: 35, status: "updating", lastUpdate: "2026-02-27" },
  { id: 8, name: "Bayawan City", province: "Negros Oriental", barangays: 28, status: "non-compliance", lastUpdate: "2026-01-10" },
];

const barangaysData = [
  { id: 1, name: "Barangay 1", municipality: "Bacolod City", province: "Negros Occidental", population: 5420, status: "updated" },
  { id: 2, name: "Barangay 2", municipality: "Bacolod City", province: "Negros Occidental", population: 4280, status: "updated" },
  { id: 3, name: "Barangay Poblacion", municipality: "Dumaguete City", province: "Negros Oriental", population: 8920, status: "updated" },
  { id: 4, name: "Barangay Banilad", municipality: "Dumaguete City", province: "Negros Oriental", population: 6150, status: "updating" },
  { id: 5, name: "Barangay Hawaiian", municipality: "Silay City", province: "Negros Occidental", population: 3840, status: "updated" },
  { id: 6, name: "Barangay Balabag", municipality: "Silay City", province: "Negros Occidental", population: 2960, status: "updated" },
];

const complianceRecordsData = [
  { id: 1, municipality: "Bacolod City", province: "Negros Occidental", reportDate: "2026-03-02", status: "compliant", officer: "Juan Dela Cruz" },
  { id: 2, municipality: "Dumaguete City", province: "Negros Oriental", reportDate: "2026-03-03", status: "compliant", officer: "Maria Santos" },
  { id: 3, municipality: "Cadiz City", province: "Negros Occidental", reportDate: "2026-01-15", status: "non-compliant", officer: "Pedro Reyes" },
  { id: 4, municipality: "Bayawan City", province: "Negros Oriental", reportDate: "2026-01-10", status: "non-compliant", officer: "Ana Garcia" },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  updated: "bg-green-100 text-green-800",
  updating: "bg-orange-100 text-orange-800",
  "non-compliance": "bg-red-100 text-red-800",
  compliant: "bg-green-100 text-green-800",
  "non-compliant": "bg-red-100 text-red-800",
};

export function CRUDManagement() {
  // component state for each entity collection
  const [provinces, setProvinces] = useState(provincesData);
  const [municipalities, setMunicipalities] = useState(municipalitiesData);
  const [barangays, setBarangays] = useState(barangaysData);
  const [records, setRecords] = useState(complianceRecordsData);

  // --- CRUD helpers for provinces ---
  const createProvince = (newProv: typeof provincesData[0]) => {
    setProvinces((prev) => [...prev, newProv]);
  };
  const updateProvince = (id: number, updates: Partial<typeof provincesData[0]>) => {
    setProvinces((prev) => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deleteProvince = (id: number) => {
    setProvinces((prev) => prev.filter(p => p.id !== id));
  };

  // other collections can use the same pattern
  const createMunicipality = (item: typeof municipalitiesData[0]) => setMunicipalities(prev => [...prev, item]);
  const updateMunicipality = (id: number, updates: Partial<typeof municipalitiesData[0]>) =>
    setMunicipalities(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  const deleteMunicipality = (id: number) => setMunicipalities(prev => prev.filter(m => m.id !== id));

  const createBarangay = (item: typeof barangaysData[0]) => setBarangays(prev => [...prev, item]);
  const updateBarangay = (id: number, updates: Partial<typeof barangaysData[0]>) =>
    setBarangays(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  const deleteBarangay = (id: number) => setBarangays(prev => prev.filter(b => b.id !== id));

  const createRecord = (item: typeof complianceRecordsData[0]) => setRecords(prev => [...prev, item]);
  const updateRecord = (id: number, updates: Partial<typeof complianceRecordsData[0]>) =>
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  const deleteRecord = (id: number) => setRecords(prev => prev.filter(r => r.id !== id));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Place Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage provinces, cities/municipalities, barangays, and compliance records
        </p>
      </div>

      <Tabs defaultValue="provinces" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="provinces">Provinces</TabsTrigger>
          <TabsTrigger value="municipalities">Cities/Municipalities</TabsTrigger>
          <TabsTrigger value="barangays">Barangays</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        {/* Provinces Tab */}
        <TabsContent value="provinces">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Provinces Management
              </CardTitle>
              <Button onClick={() => createProvince({ id: Date.now(), name: "New Province", municipalities: 0, barangays: 0, status: "active" })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Province
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Province Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Municipalities
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Barangays
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {provinces.map((province) => (
                      <tr key={province.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {province.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {province.municipalities}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {province.barangays}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColors[province.status as keyof typeof statusColors]}>
                            {province.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
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
        </TabsContent>

        {/* Municipalities Tab */}
        <TabsContent value="municipalities">
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search municipalities..." className="pl-9" />
                </div>
                <Button onClick={() => createMunicipality({ id: Date.now(), name: "New Municipality", province: "", barangays: 0, status: "active", lastUpdate: new Date().toISOString().split('T')[0] })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Municipality
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Municipalities List
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
                        Barangays
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Last Update
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {municipalities.map((municipality) => (
                      <tr key={municipality.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {municipality.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {municipality.province}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {municipality.barangays}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColors[municipality.status as keyof typeof statusColors]}>
                            {municipality.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {municipality.lastUpdate}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => updateMunicipality(municipality.id, { name: municipality.name + " (edited)" })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => deleteMunicipality(municipality.id)}
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
        </TabsContent>

        {/* Barangays Tab */}
        <TabsContent value="barangays">
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search barangays..." className="pl-9" />
                </div>
                <Button onClick={() => createBarangay({ id: Date.now(), name: "New Barangay", municipality: "", province: "", population: 0, status: "active" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Barangay
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Barangays List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Barangay Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        City/Municipality
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Province
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Population
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {barangays.map((barangay) => (
                      <tr key={barangay.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {barangay.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {barangay.municipality}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {barangay.province}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {barangay.population.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColors[barangay.status as keyof typeof statusColors]}>
                            {barangay.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => updateBarangay(barangay.id, { name: barangay.name + " (edited)" })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => deleteBarangay(barangay.id)}
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
        </TabsContent>

        {/* Compliance Records Tab */}
        <TabsContent value="records">
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search compliance records..." className="pl-9" />
                </div>
                <Button onClick={() => createRecord({ id: Date.now(), municipality: "", province: "", reportDate: new Date().toISOString().split('T')[0], status: "compliant", officer: "" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Compliance Records
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
                        Report Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Officer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {record.municipality}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {record.province}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {record.reportDate}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColors[record.status as keyof typeof statusColors]}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {record.officer}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => updateRecord(record.id, { officer: record.officer + " (edited)" })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => deleteRecord(record.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
