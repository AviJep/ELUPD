import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plus, X } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { useApiData } from "../contexts/ApiDataContext";

const statusColors = {
  updated: "#10b981",
  updating: "#f59e0b",
  "non-compliance": "#ef4444",
  expired: "#6b7280",
};

export function MapIntelligence() {
  const { isLoading, complianceRecords } = useApiData();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const filteredRecords = useMemo(() => {
    return complianceRecords.filter((record) => {
      const status = (record.status ?? "").toString();
      return filterStatus === "all" || status === filterStatus;
    });
  }, [complianceRecords, filterStatus]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([10.0, 123.0], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const hasData = filteredRecords.length > 0;

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="Loading map data..."
          message="Fetching compliance statuses from the database."
        />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="No map data yet"
          message="Compliance status data is required to visualize regions on the map."
        />
      </div>
    );
  }

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
                <h2 className="text-lg font-semibold text-gray-900">Region Status</h2>
                <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="bg-gray-50">
                    <CardContent>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {record.municipality || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {record.province || "Unknown"}
                          </div>
                        </div>
                        <Badge className="text-xs" variant="outline">
                          {record.status || "Unknown"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Updated: {record.reportDate || "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-2"
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
          Show Status List
        </Button>
      </div>
    </div>
  );
}
