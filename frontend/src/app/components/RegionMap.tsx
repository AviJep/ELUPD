import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { Municipality, CLUP_STATUS_COLORS, CLUP_STATUS_LABELS } from "../types";

interface RegionMapProps {
  municipalities: Municipality[];
  onMunicipalityClick: (municipality: Municipality) => void;
}

const NIR_PROVINCES = new Set([
  "Negros Occidental",
  "Negros Oriental",
  "Siquijor",
]);

const NAME_OVERRIDES: Record<string, string> = {
  "Salvador Benedicto": "Don Salvador Benedicto",
  "Sta. Catalina": "Santa Catalina",
};

function normalizeGeoName(municity: string): string {
  const cityMatch = municity.match(/^City of (.+)$/i);
  if (cityMatch) {
    const base = cityMatch[1].replace(/\s*\(.*?\)\s*$/, "").trim();
    return `${base} City`;
  }
  const name = municity.replace(/\s*\(.*?\)\s*$/, "").trim();
  return NAME_OVERRIDES[name] || name;
}

function matchKey(name: string): string {
  return name.replace(/\s+City$/i, "").trim().toLowerCase();
}

interface ProcessedFeature {
  name: string;
  displayName: string;
  province: string;
  pathD: string;
  cx: number;
  cy: number;
  muni: Municipality | undefined;
}

export function RegionMap({ municipalities, onMunicipalityClick }: RegionMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    muni: Municipality;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/phl_municities.geojson")
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        setGeoData({
          type: "FeatureCollection",
          features: data.features.filter((f) =>
            NIR_PROVINCES.has(f.properties?.province ?? "")
          ),
        });
      });
  }, []);

  const muniByKey = useMemo(() => {
    const map = new Map<string, Municipality>();
    for (const m of municipalities) map.set(matchKey(m.name), m);
    return map;
  }, [municipalities]);

  const { features, vbX, vbY, vbW, vbH } = useMemo(() => {
    const empty = { features: [] as ProcessedFeature[], vbX: 0, vbY: 0, vbW: 100, vbH: 100 };
    if (!geoData || geoData.features.length === 0) return empty;

    const PAD = 16;
    const INTERNAL = 800;
    const projection = geoMercator().fitExtent(
      [[PAD, PAD], [INTERNAL - PAD, INTERNAL - PAD]],
      geoData
    );
    const pathGen = geoPath(projection);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const feats: ProcessedFeature[] = geoData.features.map((f) => {
      const municity: string = f.properties?.municity ?? "";
      const province: string = f.properties?.province ?? "";
      const displayName = normalizeGeoName(municity);
      const muni = muniByKey.get(matchKey(displayName));
      const pathD = pathGen(f) || "";
      const centroid = pathGen.centroid(f);
      const bounds = pathGen.bounds(f);

      if (bounds[0][0] < minX) minX = bounds[0][0];
      if (bounds[0][1] < minY) minY = bounds[0][1];
      if (bounds[1][0] > maxX) maxX = bounds[1][0];
      if (bounds[1][1] > maxY) maxY = bounds[1][1];

      return {
        name: municity,
        displayName,
        province,
        pathD,
        cx: centroid[0] || 0,
        cy: centroid[1] || 0,
        muni,
      };
    });

    const pad = 10;
    return {
      features: feats,
      vbX: minX - pad,
      vbY: minY - pad,
      vbW: maxX - minX + pad * 2,
      vbH: maxY - minY + pad * 2,
    };
  }, [geoData, muniByKey]);

  const handleMouseEnter = useCallback(
    (fd: ProcessedFeature) => {
      if (!fd.muni) return;
      setHoveredName(fd.name);
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      setTooltipInfo({
        x: ((fd.cx - vbX) / vbW) * svgRect.width,
        y: ((fd.cy - vbY) / vbH) * svgRect.height,
        muni: fd.muni,
      });
    },
    [vbX, vbY, vbW, vbH]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredName(null);
    setTooltipInfo(null);
  }, []);

  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading map…
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Negros Island Region Map</h2>
      <svg
        ref={svgRef}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        className="w-full h-auto"
        style={{ maxHeight: 600 }}
      >
        {features.map((fd) => {
          const isHovered = hoveredName === fd.name;
          const color = fd.muni
            ? CLUP_STATUS_COLORS[fd.muni.clupStatus] || "#6b7280"
            : "#d1d5db";
          return (
            <path
              key={fd.name}
              d={fd.pathD}
              fill={color}
              stroke="#e2e8f0"
              strokeWidth={isHovered ? 1.5 : 0.5}
              strokeLinejoin="round"
              opacity={isHovered ? 1 : 0.92}
              style={{
                cursor: fd.muni ? "pointer" : "default",
                transition: "opacity 0.15s, stroke-width 0.15s",
              }}
              onMouseEnter={() => handleMouseEnter(fd)}
              onMouseLeave={handleMouseLeave}
              onClick={() => fd.muni && onMunicipalityClick(fd.muni)}
            />
          );
        })}
      </svg>

      {tooltipInfo && (
        <div
          className="absolute pointer-events-none z-10 bg-gray-900/95 text-white text-xs rounded-lg px-3 py-2 shadow-xl backdrop-blur-sm"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y - 64,
            transform: "translateX(-50%)",
            minWidth: 170,
          }}
        >
          <div className="font-semibold text-sm">{tooltipInfo.muni.name}</div>
          <div className="text-gray-400 text-[11px]">{tooltipInfo.muni.province}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: CLUP_STATUS_COLORS[tooltipInfo.muni.clupStatus] }}
            />
            <span className="font-medium">
              {CLUP_STATUS_LABELS[tooltipInfo.muni.clupStatus] || tooltipInfo.muni.clupStatus}
            </span>
          </div>
          {tooltipInfo.muni.yearApproved && (
            <div className="text-gray-400 mt-0.5">
              Approved: {tooltipInfo.muni.yearApproved}
              {tooltipInfo.muni.endYear ? ` — ${tooltipInfo.muni.endYear}` : ""}
            </div>
          )}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/95 rotate-45" />
        </div>
      )}
    </div>
  );
}

export type { Municipality };
