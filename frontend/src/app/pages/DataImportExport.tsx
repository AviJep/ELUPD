import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, FileSpreadsheet, FileText, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import * as XLSX from "xlsx"; // used to parse excel and csv files

export function DataImportExport() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const [exportProvince, setExportProvince] = useState("all");
  const [exportStatus, setExportStatus] = useState("all");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setParsedData((prev) => [...prev, ...json]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((f) => parseFile(f));
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((f) => parseFile(f));
      setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    }
  };

  const exportFilteredData = (format: "csv" | "xlsx" | "pdf") => {
    let data = parsedData;
    if (exportProvince !== "all") {
      data = data.filter(
        (r: any) => r.Province === exportProvince || r.province === exportProvince
      );
    }
    if (exportStatus !== "all") {
      data = data.filter(
        (r: any) => r.Status === exportStatus || r.status === exportStatus
      );
    }

    // simple csv export for demonstration
    if (format === "csv" || format === "xlsx") {
      const header = Object.keys(data[0] || {}).join(",");
      const csvRows = data.map((row: any) =>
        Object.values(row)
          .map((v) => `"${v}"`)
          .join(",")
      );
      const csv = [header, ...csvRows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export.${format === "xlsx" ? "xlsx" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      // stub pdf export (could implement using jsPDF) 
      alert("PDF export not implemented yet");
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Data Import and Export
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage bulk data operations for compliance records
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* Upload Area */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-base font-medium text-gray-900 mb-2">
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports CSV, Excel (.xlsx, .xls) files
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </label>
                </Button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </div>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items:center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {file}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ready to import
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                  <Button className="w-full mt-4">Import All Files</Button>

                  {/* preview of parsed data */}
                  {parsedData.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Parsed rows ({parsedData.length})
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              {Object.keys(parsedData[0]).map((h) => (
                                <th key={h} className="py-1 px-2 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.slice(0, 5).map((row, i) => (
                              <tr key={i} className="border-t">
                                {Object.values(row).map((v, j) => (
                                  <td key={j} className="py-1 px-2">
                                    {String(v)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Settings */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Import Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Target Province
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      <SelectItem value="negros-occidental">Negros Occidental</SelectItem>
                      <SelectItem value="negros-oriental">Negros Oriental</SelectItem>
                      <SelectItem value="siquijor">Siquijor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Import Mode
                  </label>
                  <Select defaultValue="append">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="append">Append to existing</SelectItem>
                      <SelectItem value="replace">Replace existing</SelectItem>
                      <SelectItem value="update">Update only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Make sure your CSV/Excel file includes columns: Province, Municipality, Barangay, Status
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Import History */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Recent Imports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { file: "negros_occidental_data.xlsx", date: "2026-03-03", records: 245, status: "success" },
                  { file: "siquijor_barangays.csv", date: "2026-03-02", records: 87, status: "success" },
                  { file: "negros_oriental_update.xlsx", date: "2026-03-01", records: 156, status: "success" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.file}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.records} records • {item.date}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {/* Export Options */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Export Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Province Filter
                  </label>
                  <Select value={exportProvince} onValueChange={setExportProvince}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      <SelectItem value="Negros Occidental">Negros Occidental</SelectItem>
                      <SelectItem value="Negros Oriental">Negros Oriental</SelectItem>
                      <SelectItem value="Siquijor">Siquijor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status Filter
                  </label>
                  <Select value={exportStatus} onValueChange={setExportStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="updated">Updated</SelectItem>
                      <SelectItem value="updating">Updating</SelectItem>
                      <SelectItem value="non-compliance">Non-Compliant</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Formats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <div className="text-base font-semibold text-gray-900 mb-2">
                  Excel Format
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Export data as .xlsx file
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => exportFilteredData("xlsx")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <div className="text-base font-semibold text-gray-900 mb-2">
                  CSV Format
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Export data as .csv file
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => exportFilteredData("csv")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <div className="text-base font-semibold text-gray-900 mb-2">
                  PDF Report
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Export as formatted report
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => exportFilteredData("pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Export Templates */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Template Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Compliance Import Template
                    </div>
                    <div className="text-xs text-gray-500">
                      Template for importing compliance data
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Barangay Data Template
                    </div>
                    <div className="text-xs text-gray-500">
                      Template for barangay information
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
