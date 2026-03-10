import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Plus, Edit, Trash2, Archive } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { useApiData } from "../contexts/ApiDataContext";

const statusColors = {
  active: "bg-green-100 text-green-800",
  updated: "bg-green-100 text-green-800",
  updating: "bg-orange-100 text-orange-800",
  "non-compliance": "bg-red-100 text-red-800",
  compliant: "bg-green-100 text-green-800",
  "non-compliant": "bg-red-100 text-red-800",
};

export function CRUDManagement() {
  const { provinces, municipalities, barangays, complianceRecords, addProvince, addMunicipality, addBarangay, addComplianceRecord } = useApiData();

  const [provinceList, setProvinceList] = useState(provinces);
  const [municipalityList, setMunicipalityList] = useState(municipalities);
  const [barangayList, setBarangayList] = useState(barangays);
  const [recordList, setRecordList] = useState(complianceRecords);

  useEffect(() => {
    setProvinceList(provinces);
  }, [provinces]);

  useEffect(() => {
    setMunicipalityList(municipalities);
  }, [municipalities]);

  useEffect(() => {
    setBarangayList(barangays);
  }, [barangays]);

  useEffect(() => {
    setRecordList(complianceRecords);
  }, [complianceRecords]);

  const [searchText, setSearchText] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all-modules");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const filteredProvinces = useMemo(() => {
    if (!searchText) return provinceList;
    return provinceList.filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [provinceList, searchText]);

  const filteredMunicipalities = useMemo(() => {
    if (!searchText) return municipalityList;
    return municipalityList.filter((m) => m.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [municipalityList, searchText]);

  const filteredBarangays = useMemo(() => {
    if (!searchText) return barangayList;
    return barangayList.filter((b) => b.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [barangayList, searchText]);

  const filteredRecords = useMemo(() => {
    if (!searchText) return recordList;
    return recordList.filter((r) =>
      (r.municipality || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (r.province || "").toLowerCase().includes(searchText.toLowerCase())
    );
  }, [recordList, searchText]);

  // --- CRUD helpers for provinces ---
  const createProvince = (newProv: any) => {
    setProvinceList((prev) => [...prev, newProv]);
    addProvince(newProv);
  };
  const updateProvince = (id: number, updates: any) => {
    setProvinceList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deleteProvince = (id: number) => {
    setProvinceList((prev) => prev.filter((p) => p.id !== id));
  };

  // other collections can use the same pattern
  const createMunicipality = (item: any) => {
    setMunicipalityList((prev) => [...prev, item]);
    addMunicipality(item);
  };
  const updateMunicipality = (id: number, updates: any) =>
    setMunicipalityList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  const deleteMunicipality = (id: number) =>
    setMunicipalityList((prev) => prev.filter((m) => m.id !== id));

  const createBarangay = (item: any) => {
    setBarangayList((prev) => [...prev, item]);
    addBarangay(item);
  };
  const updateBarangay = (id: number, updates: any) =>
    setBarangayList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  const deleteBarangay = (id: number) =>
    setBarangayList((prev) => prev.filter((b) => b.id !== id));

  const createRecord = (item: any) => {
    setRecordList((prev) => [...prev, item]);
    addComplianceRecord(item);
  };
  const updateRecord = (id: number, updates: any) =>
    setRecordList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  const deleteRecord = (id: number) =>
    setRecordList((prev) => prev.filter((r) => r.id !== id));

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
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const name = prompt("Enter new province name:");
                    if (name) {
                      createProvince({
                        id: Date.now(),
                        name,
                        municipalities: 0,
                        barangays: 0,
                        status: "active",
                      });
                      const addMun = window.confirm(
                        "Do you want to add a municipality immediately?"
                      );
                      if (addMun) {
                        const mName = prompt("Municipality name:");
                        if (mName) {
                          createMunicipality({
                            id: Date.now(),
                            name: mName,
                            province: name,
                            barangays: 0,
                            status: "active",
                            lastUpdate: new Date().toISOString().split("T")[0],
                          });
                        }
                      }
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Province
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const pName = prompt("Enter province name for new municipality:");
                    if (pName) {
                      const mName = prompt("Municipality name:");
                      if (mName) {
                        createMunicipality({
                          id: Date.now(),
                          name: mName,
                          province: pName,
                          barangays: 0,
                          status: "active",
                          lastUpdate: new Date().toISOString().split("T")[0],
                        });
                        alert("Municipality added. It will appear in lists immediately.");
                      }
                    }
                  }}
                >
                  Add Municipality
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {provinceList.length === 0 ? (
                  <EmptyState
                    title="No provinces yet"
                    message="Add a province to start building your region database."
                    actionLabel="Add Province"
                    onAction={() => {
                      const name = prompt("Enter new province name:");
                      if (name) {
                        createProvince({
                          id: Date.now(),
                          name,
                          municipalities: 0,
                          barangays: 0,
                          status: "active",
                        });
                      }
                    }}
                  />
                ) : (
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
                      {provinceList.map((province) => (
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
                )}
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
                {municipalityList.length === 0 ? (
                  <EmptyState
                    title="No municipalities yet"
                    message="Add a municipality to start tracking compliance status."
                    actionLabel="Add Municipality"
                    onAction={() =>
                      createMunicipality({
                        id: Date.now(),
                        name: "New Municipality",
                        province: "",
                        barangays: 0,
                        status: "active",
                        lastUpdate: new Date().toISOString().split("T")[0],
                      })
                    }
                  />
                ) : (
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
                      {municipalityList.map((municipality) => (
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
                )}
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
                {barangayList.length === 0 ? (
                  <EmptyState
                    title="No barangays yet"
                    message="Add barangays to start tracking local compliance status."
                    actionLabel="Add Barangay"
                    onAction={() =>
                      createBarangay({
                        id: Date.now(),
                        name: "New Barangay",
                        municipality: "",
                        province: "",
                        population: 0,
                        status: "active",
                      })
                    }
                  />
                ) : (
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
                      {barangayList.map((barangay) => (
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
                )}
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
                {records.length === 0 ? (
                  <EmptyState
                    title="No compliance records yet"
                    message="Create a compliance record to start tracking progress."
                    actionLabel="Add Record"
                    onAction={() =>
                      createRecord({
                        id: Date.now(),
                        municipality: "",
                        province: "",
                        reportDate: new Date().toISOString().split("T")[0],
                        status: "compliant",
                        officer: "",
                      })
                    }
                  />
                ) : (
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
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
