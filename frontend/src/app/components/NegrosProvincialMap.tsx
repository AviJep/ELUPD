import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { CLUP_STATUS_COLORS, CLUP_STATUS_LABELS } from "../types";

interface NegrosProvincialMapProps {
  provincesData: {
    name: string;
    status: string;
    legacyStatus: 'updated' | 'for-updating' | 'no-clup' | 'expired';
    approvedYear?: number | null;
    endYear?: number | null;
  }[];
}

const NIR_PROVINCES = new Set([
  "Negros Occidental",
  "Negros Oriental",
  "Siquijor",
]);

const INTERNAL = 800;
const PAD = 16;

export function NegrosProvincialMap({ provincesData }: NegrosProvincialMapProps) {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/phl_provinces_ncr-districts_icc.geojson")
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        const filtered: FeatureCollection = {
          type: "FeatureCollection",
          features: data.features.filter((f) =>
            NIR_PROVINCES.has(f.properties?.province ?? "")
          ),
        };
        setGeoJSON(filtered);
      });
  }, []);

  const provinceLookup = useMemo(() => {
    const map = new Map<string, typeof provincesData[0]>();
    for (const p of provincesData) {
      map.set(p.name, p);
    }
    return map;
  }, [provincesData]);

  const { features, vbX, vbY, vbW, vbH } = useMemo(() => {
    const empty = { features: [] as any[], vbX: 0, vbY: 0, vbW: 100, vbH: 100 };
    if (!geoJSON || geoJSON.features.length === 0) return empty;

    const projection = geoMercator().fitExtent(
      [[PAD, PAD], [INTERNAL - PAD, INTERNAL - PAD]],
      geoJSON
    );
    const pathGen = geoPath(projection);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const feats = geoJSON.features.map((f) => {
      const name = f.properties?.province ?? "";
      const data = provinceLookup.get(name);
      const pathD = pathGen(f) || "";
      const centroid = pathGen.centroid(f);
      const bounds = pathGen.bounds(f);

      if (bounds[0][0] < minX) minX = bounds[0][0];
      if (bounds[0][1] < minY) minY = bounds[0][1];
      if (bounds[1][0] > maxX) maxX = bounds[1][0];
      if (bounds[1][1] > maxY) maxY = bounds[1][1];

      return {
        name,
        pathD,
        cx: centroid[0] || 0,
        cy: centroid[1] || 0,
        data,
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
  }, [geoJSON, provinceLookup]);

  if (!geoJSON) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm font-medium">
        Loading Provincial Layers…
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        className="w-full h-auto"
        style={{ maxHeight: 500 }}
      >
        <defs>
          <filter id="mapShadowProv" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000030" />
          </filter>
        </defs>

        <g filter="url(#mapShadowProv)">
          {features.map((fd) => {
            const isHovered = hoveredName === fd.name;
            const color = fd.data
              ? CLUP_STATUS_COLORS[fd.data.legacyStatus] || "#6b7280"
              : "#d1d5db";

            return (
              <path
                key={fd.name}
                d={fd.pathD}
                fill={color}
                stroke="#1e3a5f"
                strokeWidth={isHovered ? 2.5 : 1.2}
                strokeLinejoin="round"
                opacity={isHovered ? 1 : 0.92}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.15s, stroke-width 0.15s",
                }}
                onMouseEnter={() => setHoveredName(fd.name)}
                onMouseLeave={() => setHoveredName(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* Centered Labels - Styled to match tooltip logic but visible */}
      <div className="absolute inset-0 pointer-events-none">
        {features.map((fd) => {
          if (!fd.data) return null;
          const left = ((fd.cx - vbX) / vbW) * 100;
          const top = ((fd.cy - vbY) / vbH) * 100;
          
          return (
            <div 
              key={fd.name}
              className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className={`bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 shadow-xl ${hoveredName === fd.name ? 'scale-110' : 'scale-100'}`}>
                <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{fd.name}</p>
                <p className="text-[8px] font-bold text-blue-300 uppercase mt-1 leading-none">{fd.data.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
