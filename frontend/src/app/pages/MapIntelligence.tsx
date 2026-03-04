import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { Badge } from "../components/ui/badge";

// Mock GeoJSON data for Negros Island municipalities
const negrosGeoJSON = {
  type: "FeatureCollection",
  features: [
    // Negros Occidental
    { type: "Feature", properties: { name: "Bacolod City", province: "Negros Occidental", status: "updated", barangayCount: 61, lastUpdate: "2026-03-02" }, geometry: { type: "Polygon", coordinates: [[[122.95, 10.68], [122.98, 10.68], [122.98, 10.65], [122.95, 10.65], [122.95, 10.68]]] } },
    { type: "Feature", properties: { name: "Silay City", province: "Negros Occidental", status: "updated", barangayCount: 16, lastUpdate: "2026-03-01" }, geometry: { type: "Polygon", coordinates: [[[122.95, 10.80], [122.99, 10.80], [122.99, 10.76], [122.95, 10.76], [122.95, 10.80]]] } },
    { type: "Feature", properties: { name: "Talisay City", province: "Negros Occidental", status: "updating", barangayCount: 14, lastUpdate: "2026-02-28" }, geometry: { type: "Polygon", coordinates: [[[122.94, 10.73], [122.97, 10.73], [122.97, 10.70], [122.94, 10.70], [122.94, 10.73]]] } },
    { type: "Feature", properties: { name: "Victorias City", province: "Negros Occidental", status: "updated", barangayCount: 25, lastUpdate: "2026-03-03" }, geometry: { type: "Polygon", coordinates: [[[122.98, 10.90], [123.02, 10.90], [123.02, 10.86], [122.98, 10.86], [122.98, 10.90]]] } },
    { type: "Feature", properties: { name: "Cadiz City", province: "Negros Occidental", status: "non-compliance", barangayCount: 23, lastUpdate: "2026-01-15" }, geometry: { type: "Polygon", coordinates: [[[123.27, 10.95], [123.31, 10.95], [123.31, 10.91], [123.27, 10.91], [123.27, 10.95]]] } },
    { type: "Feature", properties: { name: "Sagay City", province: "Negros Occidental", status: "updated", barangayCount: 25, lastUpdate: "2026-03-01" }, geometry: { type: "Polygon", coordinates: [[[123.40, 10.90], [123.45, 10.90], [123.45, 10.85], [123.40, 10.85], [123.40, 10.90]]] } },
    { type: "Feature", properties: { name: "Bago City", province: "Negros Occidental", status: "updating", barangayCount: 24, lastUpdate: "2026-02-25" }, geometry: { type: "Polygon", coordinates: [[[122.82, 10.53], [122.86, 10.53], [122.86, 10.49], [122.82, 10.49], [122.82, 10.53]]] } },
    { type: "Feature", properties: { name: "Himamaylan City", province: "Negros Occidental", status: "updated", barangayCount: 23, lastUpdate: "2026-03-02" }, geometry: { type: "Polygon", coordinates: [[[122.85, 10.10], [122.89, 10.10], [122.89, 10.06], [122.85, 10.06], [122.85, 10.10]]] } },
    { type: "Feature", properties: { name: "Kabankalan City", province: "Negros Occidental", status: "expired", barangayCount: 32, lastUpdate: "2025-11-20" }, geometry: { type: "Polygon", coordinates: [[[122.80, 9.99], [122.85, 9.99], [122.85, 9.95], [122.80, 9.95], [122.80, 9.99]]] } },
    { type: "Feature", properties: { name: "La Carlota City", province: "Negros Occidental", status: "updated", barangayCount: 14, lastUpdate: "2026-03-04" }, geometry: { type: "Polygon", coordinates: [[[122.91, 10.42], [122.95, 10.42], [122.95, 10.38], [122.91, 10.38], [122.91, 10.42]]] } },
    
    // Negros Oriental
    { type: "Feature", properties: { name: "Dumaguete City", province: "Negros Oriental", status: "updated", barangayCount: 30, lastUpdate: "2026-03-03" }, geometry: { type: "Polygon", coordinates: [[[123.30, 9.31], [123.34, 9.31], [123.34, 9.27], [123.30, 9.27], [123.30, 9.31]]] } },
    { type: "Feature", properties: { name: "Bais City", province: "Negros Oriental", status: "updating", barangayCount: 35, lastUpdate: "2026-02-27" }, geometry: { type: "Polygon", coordinates: [[[123.11, 9.59], [123.15, 9.59], [123.15, 9.55], [123.11, 9.55], [123.11, 9.59]]] } },
    { type: "Feature", properties: { name: "Bayawan City", province: "Negros Oriental", status: "non-compliance", barangayCount: 28, lastUpdate: "2026-01-10" }, geometry: { type: "Polygon", coordinates: [[[122.80, 9.37], [122.84, 9.37], [122.84, 9.33], [122.80, 9.33], [122.80, 9.37]]] } },
    { type: "Feature", properties: { name: "Canlaon City", province: "Negros Oriental", status: "updated", barangayCount: 15, lastUpdate: "2026-03-01" }, geometry: { type: "Polygon", coordinates: [[[123.19, 10.38], [123.23, 10.38], [123.23, 10.34], [123.19, 10.34], [123.19, 10.38]]] } },
    { type: "Feature", properties: { name: "Guihulngan City", province: "Negros Oriental", status: "updated", barangayCount: 33, lastUpdate: "2026-03-02" }, geometry: { type: "Polygon", coordinates: [[[123.27, 10.12], [123.31, 10.12], [123.31, 10.08], [123.27, 10.08], [123.27, 10.12]]] } },
    { type: "Feature", properties: { name: "Tanjay City", province: "Negros Oriental", status: "updating", barangayCount: 24, lastUpdate: "2026-02-26" }, geometry: { type: "Polygon", coordinates: [[[123.15, 9.52], [123.19, 9.52], [123.19, 9.48], [123.15, 9.48], [123.15, 9.52]]] } },
    
    // Siquijor
    { type: "Feature", properties: { name: "Siquijor", province: "Siquijor", status: "updated", barangayCount: 42, lastUpdate: "2026-03-01" }, geometry: { type: "Polygon", coordinates: [[[123.49, 9.21], [123.53, 9.21], [123.53, 9.17], [123.49, 9.17], [123.49, 9.21]]] } },
    { type: "Feature", properties: { name: "Larena", province: "Siquijor", status: "updated", barangayCount: 15, lastUpdate: "2026-03-02" }, geometry: { type: "Polygon", coordinates: [[[123.60, 9.27], [123.64, 9.27], [123.64, 9.23], [123.60, 9.23], [123.60, 9.27]]] } },
    { type: "Feature", properties: { name: "Enrique Villanueva", province: "Siquijor", status: "updating", barangayCount: 13, lastUpdate: "2026-02-28" }, geometry: { type: "Polygon", coordinates: [[[123.64, 9.22], [123.68, 9.22], [123.68, 9.18], [123.64, 9.18], [123.64, 9.22]]] } },
    { type: "Feature", properties: { name: "Lazi", province: "Siquijor", status: "updated", barangayCount: 23, lastUpdate: "2026-03-03" }, geometry: { type: "Polygon", coordinates: [[[123.59, 9.13], [123.63, 9.13], [123.63, 9.09], [123.59, 9.09], [123.59, 9.13]]] } },
    { type: "Feature", properties: { name: "Maria", province: "Siquijor", status: "non-compliance", barangayCount: 21, lastUpdate: "2026-01-20" }, geometry: { type: "Polygon", coordinates: [[[123.51, 9.15], [123.55, 9.15], [123.55, 9.11], [123.51, 9.11], [123.51, 9.15]]] } },
    { type: "Feature", properties: { name: "San Juan", province: "Siquijor", status: "updated", barangayCount: 15, lastUpdate: "2026-03-04" }, geometry: { type: "Polygon", coordinates: [[[123.48, 9.27], [123.52, 9.27], [123.52, 9.23], [123.48, 9.23], [123.48, 9.27]]] } },
  ],
};

const statusColors = {
  updated: "#10b981",
  updating: "#f59e0b",
  "non-compliance": "#ef4444",
  expired: "#6b7280",
};

type StatusType = keyof typeof statusColors;

export function MapIntelligence() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [barangays, setBarangays] = useState<string[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([10.0, 123.0], 9);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    // Add GeoJSON layer
    renderGeoJSON();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      renderGeoJSON();
    }
  }, [filterStatus]);

  const renderGeoJSON = () => {
    if (!mapRef.current) return;

    // Remove existing layer
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    // Filter features based on status
    const filteredFeatures = filterStatus === "all"
      ? negrosGeoJSON.features
      : negrosGeoJSON.features.filter((f) => f.properties.status === filterStatus);

    const filteredGeoJSON = {
      ...negrosGeoJSON,
      features: filteredFeatures,
    };

    // Add new layer
    const geoJsonLayer = L.geoJSON(filteredGeoJSON as any, {
      style: (feature) => ({
        fillColor: statusColors[feature?.properties.status as StatusType] || "#6b7280",
        weight: 2,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: 0.6,
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 3,
              fillOpacity: 0.8,
            });
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            setSelectedFeature(feature.properties);
            setPanelOpen(true);
            setSelectedProvince(feature.properties.province);
            setSelectedCity(feature.properties.name);
            // Mock barangays
            setBarangays(Array.from({ length: 5 }, (_, i) => `Barangay ${i + 1}`));
          },
        });

        layer.bindTooltip(
          `<div class="text-sm">
            <div class="font-semibold">${feature.properties.name}</div>
            <div class="text-xs text-gray-600">${feature.properties.province}</div>
            <div class="text-xs mt-1">Status: <span class="font-medium">${feature.properties.status}</span></div>
            <div class="text-xs">Barangays: ${feature.properties.barangayCount}</div>
            <div class="text-xs">Last Update: ${feature.properties.lastUpdate}</div>
          </div>`,
          { className: "custom-tooltip" }
        );
      },
    });

    geoJsonLayer.addTo(mapRef.current);
    geoJsonLayerRef.current = geoJsonLayer;
  };

  const handleAddBarangay = () => {
    const name = prompt("Enter barangay name:");
    if (name) {
      setBarangays([...barangays, name]);
    }
  };

  const handleRemoveBarangay = (index: number) => {
    setBarangays(barangays.filter((_, i) => i !== index));
  };

  return (
    <div className="h-[calc(100vh-64px)] relative">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-white shadow-lg w-64">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Status Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => setFilterStatus("all")}
          >
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 via-orange-500 to-red-500" />
            <span className="text-xs font-medium">All Regions</span>
          </div>
          {Object.entries(statusColors).map(([status, color]) => (
            <div
              key={status}
              className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => setFilterStatus(status)}
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs capitalize">{status.replace("-", " ")}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Side Panel */}
      {panelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[1001]"
            onClick={() => setPanelOpen(false)}
          />
          <div className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-[1002] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Region Management
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPanelOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {selectedFeature && (
                <div className="space-y-6">
                  {/* Selected Region Info */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedFeature.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedFeature.province}
                      </div>
                      <Badge
                        className="mt-2"
                        style={{
                          backgroundColor: statusColors[selectedFeature.status as StatusType],
                        }}
                      >
                        {selectedFeature.status}
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Province Selector */}
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Negros Occidental">Negros Occidental</SelectItem>
                        <SelectItem value="Negros Oriental">Negros Oriental</SelectItem>
                        <SelectItem value="Siquijor">Siquijor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City/Municipality Selector */}
                  <div className="space-y-2">
                    <Label>City / Municipality</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city or municipality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bacolod City">Bacolod City</SelectItem>
                        <SelectItem value="Dumaguete City">Dumaguete City</SelectItem>
                        <SelectItem value="Silay City">Silay City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Barangay Management */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Barangays ({barangays.length})</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddBarangay}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {barangays.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No barangays added
                        </div>
                      ) : (
                        <div className="divide-y">
                          {barangays.map((barangay, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 hover:bg-gray-50"
                            >
                              <span className="text-sm">{barangay}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveBarangay(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-2">
                    <Label>Compliance Status</Label>
                    <Select defaultValue={selectedFeature.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated">Updated</SelectItem>
                        <SelectItem value="updating">Updating</SelectItem>
                        <SelectItem value="non-compliance">Non-Compliance</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Last Update */}
                  <div className="space-y-2">
                    <Label>Last Update</Label>
                    <Input
                      type="date"
                      defaultValue={selectedFeature.lastUpdate}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" variant="default">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Map
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
