import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X, Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { nirMunicipalities } from "../utils/clup-data";
import { CLUP_STATUS_COLORS, CLUP_STATUS_LABELS } from "../types";
import type { CLUPStatus, Municipality } from "../types";

// ─── Constants ───────────────────────────────────────────────────────

const NIR_PROVINCES = new Set(["Negros Occidental", "Negros Oriental", "Siquijor"]);
const SVG_W = 520;
const SVG_H = 780;
const PAD = 20;

const statusColors: Record<string, string> = {
  ...CLUP_STATUS_COLORS,
  expired: "#6b7280",
};

// ─── Name normalizer (GeoJSON → CLUP data) ──────────────────────────

const NAME_OVERRIDES: Record<string, string> = {
  "Salvador Benedicto": "Don Salvador Benedicto",
  "Sta. Catalina": "Santa Catalina",
};

function normalizeGeoName(municity: string): string {
  const cityMatch = municity.match(/^City of (.+)$/i);
  if (cityMatch) {
    let base = cityMatch[1].replace(/\s*\(.*?\)\s*$/, "").trim();
    return `${base} City`;
  }
  let name = municity.replace(/\s*\(.*?\)\s*$/, "").trim();
  return NAME_OVERRIDES[name] || name;
}

function matchKey(name: string): string {
  return name.replace(/\s+City$/i, "").trim().toLowerCase();
}

// ─── Processed feature type ─────────────────────────────────────────

interface ProcessedFeature {
  name: string;
  displayName: string;
  province: string;
  pathD: string;
  cx: number;
  cy: number;
  clupStatus: CLUPStatus;
  yearApproved: number | null;
  endYear: number | null;
  riskInformed: boolean;
  lastUpdate: string;
  muniName: string;
}

export function MapIntelligence() {
  const [nirGeoJSON, setNirGeoJSON] = useState<FeatureCollection | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<ProcessedFeature | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [barangays, setBarangays] = useState<string[]>([]);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    feat: ProcessedFeature;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch GeoJSON once
  useEffect(() => {
    fetch("/phl_municities.geojson")
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        const filtered: FeatureCollection = {
          type: "FeatureCollection",
          features: data.features.filter((f) =>
            NIR_PROVINCES.has(f.properties?.province ?? "")
          ),
        };
        setNirGeoJSON(filtered);
      });
  }, []);

  // Municipality lookup
  const muniByKey = useMemo(() => {
    const map = new Map<string, Municipality>();
    for (const m of nirMunicipalities) {
      map.set(matchKey(m.name), m);
    }
    return map;
  }, []);

  // Process features with d3-geo projection
  const { allFeatures, provinceOutlines } = useMemo(() => {
    if (!nirGeoJSON) return { allFeatures: [] as ProcessedFeature[], provinceOutlines: [] as { province: string; d: string }[] };

    const projection = geoMercator().fitExtent(
      [[PAD, PAD], [SVG_W - PAD, SVG_H - PAD]],
      nirGeoJSON
    );
    const pathGen = geoPath(projection);

    const feats: ProcessedFeature[] = nirGeoJSON.features.map((f) => {
      const municity: string = f.properties?.municity ?? "";
      const province: string = f.properties?.province ?? "";
      const displayName = normalizeGeoName(municity);
      const key = matchKey(displayName);
      const muni = muniByKey.get(key);
      const pathD = pathGen(f) || "";
      const centroid = pathGen.centroid(f);

      return {
        name: municity,
        displayName,
        province,
        pathD,
        cx: centroid[0] || 0,
        cy: centroid[1] || 0,
        clupStatus: (muni?.clupStatus || "no-clup") as CLUPStatus,
        yearApproved: muni?.yearApproved || null,
        endYear: muni?.endYear || null,
        riskInformed: muni?.riskInformed || false,
        lastUpdate: muni?.lastUpdate || "",
        muniName: muni?.name || displayName,
      };
    });

    const groups: Record<string, string[]> = {};
    for (const fd of feats) {
      const p = fd.province || "Unknown";
      if (!groups[p]) groups[p] = [];
      groups[p].push(fd.pathD);
    }
    const outlines = Object.entries(groups).map(([province, paths]) => ({
      province,
      d: paths.join(" "),
    }));

    return { allFeatures: feats, provinceOutlines: outlines };
  }, [nirGeoJSON, muniByKey]);

  // Filter features by CLUP status
  const visibleFeatures = useMemo(() => {
    if (filterStatus === "all") return allFeatures;
    return allFeatures.filter((f) => f.clupStatus === filterStatus);
  }, [filterStatus, allFeatures]);

  const handleMouseEnter = useCallback(
    (fd: ProcessedFeature, e: React.MouseEvent<SVGPathElement>) => {
      setHoveredName(fd.name);
      const svgRect = (
        e.target as SVGElement
      ).closest("svg")!.getBoundingClientRect();
      setTooltipInfo({
        x: (fd.cx / SVG_W) * svgRect.width + svgRect.left,
        y: (fd.cy / SVG_H) * svgRect.height + svgRect.top,
        feat: fd,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredName(null);
    setTooltipInfo(null);
  }, []);

  const handleFeatureClick = useCallback(
    (fd: ProcessedFeature) => {
      setSelectedFeature(fd);
      setPanelOpen(true);
      setSelectedProvince(fd.province);
      setSelectedCity(fd.muniName);
      setBarangays(Array.from({ length: 5 }, (_, i) => `Barangay ${i + 1}`));
    },
    []
  );

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
    <div className="h-[calc(100vh-64px)] relative flex items-center justify-center bg-slate-100">
      {/* Static SVG Map — centred in viewport, no interactivity */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-full max-h-[calc(100vh-80px)] w-auto select-none"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
      >
        <defs>
          <filter id="miMapShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000025" />
          </filter>
        </defs>

        <g filter="url(#miMapShadow)">
          {visibleFeatures.map((fd) => {
            const isHovered = hoveredName === fd.name;
            const color = statusColors[fd.clupStatus] || "#6b7280";

            return (
              <path
                key={fd.name}
                d={fd.pathD}
                fill={color}
                stroke="#fff"
                strokeWidth={isHovered ? 2.8 : 0.7}
                strokeLinejoin="round"
                opacity={isHovered ? 1 : 0.92}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.15s, stroke-width 0.15s",
                }}
                onMouseEnter={(e) => handleMouseEnter(fd, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleFeatureClick(fd)}
              />
            );
          })}

          {/* Province outlines */}
          {provinceOutlines.map(({ province, d }) => (
            <path
              key={province}
              d={d}
              fill="none"
              stroke="#1e3a5f"
              strokeWidth={1.6}
              strokeLinejoin="round"
              pointerEvents="none"
            />
          ))}
        </g>
      </svg>

      {/* Floating tooltip (portal-style, positioned to viewport) */}
      {tooltipInfo && (
        <div
          className="fixed pointer-events-none z-[2000] bg-gray-900/95 text-white text-xs rounded-lg px-3 py-2 shadow-xl backdrop-blur-sm"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y - 70,
            transform: "translateX(-50%)",
            minWidth: 180,
          }}
        >
          <div className="font-semibold text-sm">{tooltipInfo.feat.muniName}</div>
          <div className="text-gray-400 text-[11px]">{tooltipInfo.feat.province}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: statusColors[tooltipInfo.feat.clupStatus] }}
            />
            <span className="font-medium">
              {CLUP_STATUS_LABELS[tooltipInfo.feat.clupStatus] || tooltipInfo.feat.clupStatus}
            </span>
          </div>
          {tooltipInfo.feat.yearApproved && (
            <div className="text-gray-400 mt-0.5">
              Approved: {tooltipInfo.feat.yearApproved}
              {tooltipInfo.feat.endYear ? ` — ${tooltipInfo.feat.endYear}` : ""}
            </div>
          )}
          <div className="text-gray-400">Last Update: {tooltipInfo.feat.lastUpdate}</div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/95 rotate-45" />
        </div>
      )}

      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur shadow-lg w-56">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">CLUP Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <button
            className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-50 transition-colors ${filterStatus === "all" ? "bg-gray-100 font-medium" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 via-orange-500 to-red-500" />
            <span className="text-xs">All Municipalities</span>
          </button>
          {[
            { key: "updated", label: "Updated", color: "#10b981" },
            { key: "for-updating", label: "For Updating", color: "#f59e0b" },
            { key: "no-clup", label: "No CLUP", color: "#ef4444" },
            { key: "expired", label: "Expired", color: "#6b7280" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-50 transition-colors ${filterStatus === key ? "bg-gray-100 font-medium" : ""}`}
              onClick={() => setFilterStatus(key)}
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs">{label}</span>
            </button>
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
                        {selectedFeature.muniName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedFeature.province}
                      </div>
                      <Badge
                        className="mt-2"
                        style={{
                          backgroundColor: statusColors[selectedFeature.clupStatus] || "#6b7280",
                        }}
                      >
                        {CLUP_STATUS_LABELS[selectedFeature.clupStatus as CLUPStatus] || selectedFeature.clupStatus}
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
                    <Label>CLUP Status</Label>
                    <Select defaultValue={selectedFeature.clupStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated">Updated</SelectItem>
                        <SelectItem value="for-updating">For Updating</SelectItem>
                        <SelectItem value="no-clup">No CLUP</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Last Update */}
                  <div className="space-y-2">
                    <Label>Last Update</Label>
                    <Input
                      type="date"
                      defaultValue={selectedFeature.lastUpdate || ""}
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
