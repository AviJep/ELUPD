import { useState } from 'react';
import { Municipality, CLUP_STATUS_BG } from '../types';

interface InteractiveMapProps {
  municipalities: Municipality[];
  onMunicipalityClick: (municipality: Municipality) => void;
}

// Approximate coordinates for Negros Island Region municipalities
const MUNICIPALITY_COORDS: Record<string, { x: number; y: number }> = {
  'Bacolod City': { x: 30, y: 60 },
  'Bago City': { x: 40, y: 55 },
  'Cadiz City': { x: 25, y: 50 },
  'Escalante City': { x: 20, y: 45 },
  'Himamaylan City': { x: 50, y: 65 },
  'Kabankalan City': { x: 55, y: 70 },
  'La Carlota City': { x: 45, y: 55 },
  'Sagay City': { x: 22, y: 48 },
  'San Carlos City': { x: 35, y: 45 },
  'Silay City': { x: 28, y: 55 },
  'Talisay City': { x: 32, y: 58 },
  'Victorias City': { x: 20, y: 55 },
  'Binalbagan': { x: 48, y: 60 },
  'Cauayan': { x: 65, y: 75 },
  'Manapla': { x: 24, y: 52 },
  'Dumaguete City': { x: 80, y: 80 },
  'Bais City': { x: 75, y: 70 },
  'Bayawan City': { x: 85, y: 65 },
  'Canlaon City': { x: 65, y: 55 },
  'Guihulngan City': { x: 70, y: 50 },
  'Tanjay City': { x: 78, y: 75 },
  'Amlan': { x: 82, y: 78 },
  'Bacong': { x: 83, y: 82 },
  'Sibulan': { x: 80, y: 85 },
  'Sta. Catalina': { x: 88, y: 78 },
  'Manjuyod': { x: 72, y: 72 },
  'Zamboanguita': { x: 86, y: 85 },
  'Siquijor': { x: 95, y: 90 },
  'Enrique Villanueva': { x: 92, y: 88 },
  'Larena': { x: 90, y: 92 },
  'Lazi': { x: 97, y: 88 },
  'Maria': { x: 94, y: 85 },
  'San Juan': { x: 93, y: 92 },
};

export function InteractiveMap({ municipalities, onMunicipalityClick }: InteractiveMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Interactive Map - Negros Island Region</h2>
      
      <div className="relative bg-blue-50 rounded-lg h-96 overflow-hidden border-2 border-blue-200">
        {/* Island outline background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 15 40 Q 30 25 50 30 Q 70 20 90 35 Q 95 50 85 70 Q 70 85 50 80 Q 30 90 15 70 Q 10 55 15 40 Z"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="0.5"
          />
        </svg>
        
        {/* Province labels */}
        <div className="absolute top-2 left-2 text-xs font-bold text-gray-500">Negros Occidental</div>
        <div className="absolute top-2 right-2 text-xs font-bold text-gray-500">Negros Oriental</div>
        <div className="absolute bottom-2 right-8 text-xs font-bold text-gray-500">Siquijor</div>
        
        {/* Municipality markers */}
        {municipalities.map((municipality) => {
          const coords = MUNICIPALITY_COORDS[municipality.name] || { x: 50, y: 50 };
          const isHovered = hoveredId === municipality.id;
          
          return (
            <button
              key={municipality.id}
              onClick={() => onMunicipalityClick(municipality)}
              onMouseEnter={() => setHoveredId(municipality.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                isHovered ? 'scale-150 z-10' : 'scale-100'
              }`}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              <div className={`w-4 h-4 rounded-full ${CLUP_STATUS_BG[municipality.clupStatus]} border-2 border-white shadow-md`} />
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-20">
                  {municipality.name}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="mt-4 text-sm text-gray-600 text-center">
        Click on a marker to view municipality details
      </p>
    </div>
  );
}
