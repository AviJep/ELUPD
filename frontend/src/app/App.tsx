import { useState } from 'react';
import { RegionMap, Municipality } from './components/RegionMap';
import { StatusLegend } from './components/StatusLegend';
import { StatisticsCard } from './components/StatisticsCard';
import { MunicipalityModal } from './components/MunicipalityModal';
import { InteractiveMap } from './components/InteractiveMap';
import { Sidebar } from './components/Sidebar';
import { StatisticalReports } from './components/StatisticalReports';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

// Mock data for Negros Island Region including Siquijor
const initialMunicipalities: Municipality[] = [
  // Negros Occidental
  { id: '1', name: 'Bacolod City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-03-01' },
  { id: '2', name: 'Bago City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-02-28' },
  { id: '3', name: 'Cadiz City', status: 'updating', province: 'Negros Occidental', lastUpdate: '2026-01-15' },
  { id: '4', name: 'Escalante City', status: 'non-compliance', province: 'Negros Occidental', lastUpdate: '2025-11-20' },
  { id: '5', name: 'Himamaylan City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-03-02' },
  { id: '6', name: 'Kabankalan City', status: 'updating', province: 'Negros Occidental', lastUpdate: '2026-01-10' },
  { id: '7', name: 'La Carlota City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-02-25' },
  { id: '8', name: 'Sagay City', status: 'non-compliance', province: 'Negros Occidental', lastUpdate: '2025-10-15' },
  { id: '9', name: 'San Carlos City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-03-01' },
  { id: '10', name: 'Silay City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-02-27' },
  { id: '11', name: 'Talisay City', status: 'updating', province: 'Negros Occidental', lastUpdate: '2026-01-20' },
  { id: '12', name: 'Victorias City', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-03-03' },
  { id: '13', name: 'Binalbagan', status: 'non-compliance', province: 'Negros Occidental', lastUpdate: '2025-12-01' },
  { id: '14', name: 'Cauayan', status: 'updated', province: 'Negros Occidental', lastUpdate: '2026-02-26' },
  { id: '15', name: 'Manapla', status: 'updating', province: 'Negros Occidental', lastUpdate: '2026-01-18' },
  
  // Negros Oriental
  { id: '16', name: 'Dumaguete City', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-03-02' },
  { id: '17', name: 'Bais City', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-03-01' },
  { id: '18', name: 'Bayawan City', status: 'updating', province: 'Negros Oriental', lastUpdate: '2026-02-01' },
  { id: '19', name: 'Canlaon City', status: 'non-compliance', province: 'Negros Oriental', lastUpdate: '2025-11-10' },
  { id: '20', name: 'Guihulngan City', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-02-28' },
  { id: '21', name: 'Tanjay City', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-03-03' },
  { id: '22', name: 'Amlan', status: 'updating', province: 'Negros Oriental', lastUpdate: '2026-01-25' },
  { id: '23', name: 'Bacong', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-02-27' },
  { id: '24', name: 'Sibulan', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-03-01' },
  { id: '25', name: 'Sta. Catalina', status: 'non-compliance', province: 'Negros Oriental', lastUpdate: '2025-12-15' },
  { id: '26', name: 'Manjuyod', status: 'updating', province: 'Negros Oriental', lastUpdate: '2026-02-10' },
  { id: '27', name: 'Zamboanguita', status: 'updated', province: 'Negros Oriental', lastUpdate: '2026-02-26' },
  
  // Siquijor
  { id: '28', name: 'Siquijor', status: 'updated', province: 'Siquijor', lastUpdate: '2026-03-01' },
  { id: '29', name: 'Enrique Villanueva', status: 'updating', province: 'Siquijor', lastUpdate: '2026-01-30' },
  { id: '30', name: 'Larena', status: 'updated', province: 'Siquijor', lastUpdate: '2026-03-02' },
  { id: '31', name: 'Lazi', status: 'updated', province: 'Siquijor', lastUpdate: '2026-02-28' },
  { id: '32', name: 'Maria', status: 'non-compliance', province: 'Siquijor', lastUpdate: '2025-11-25' },
  { id: '33', name: 'San Juan', status: 'updated', province: 'Siquijor', lastUpdate: '2026-03-03' },
];

export default function App() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>(initialMunicipalities);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredMunicipalities =
    filterStatus === 'all'
      ? municipalities
      : municipalities.filter((m) => m.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            Negros Island Region Compliance Monitor
          </h1>
          <p className="text-gray-600">Including Siquijor Province</p>
        </div>

        {/* Statistics */}
        <StatisticsCard municipalities={municipalities} />

        {/* Toggle Statistics Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg"
          >
            {showStatistics ? 'Hide Detailed Statistics' : 'Show Detailed Statistics'}
          </button>
        </div>

        {/* Detailed Statistical Reports */}
        {showStatistics && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistical Analysis</h2>
            <StatisticalReports municipalities={municipalities} />
          </div>
        )}

        {/* Analytics Dashboard Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-lg"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {showAnalytics && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <AnalyticsDashboard />
          </div>
        )}

        {/* Legend and Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatusLegend />
          </div>
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filter by Status</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('updated')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'updated'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Updated
              </button>
              <button
                onClick={() => setFilterStatus('updating')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'updating'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Updating / Expired
              </button>
              <button
                onClick={() => setFilterStatus('non-compliance')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === 'non-compliance'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Non-Compliance
              </button>
            </div>
          </div>
        </div>

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <InteractiveMap
            municipalities={filteredMunicipalities}
            onMunicipalityClick={setSelectedMunicipality}
          />
        ) : (
          <RegionMap
            municipalities={filteredMunicipalities}
            onMunicipalityClick={setSelectedMunicipality}
          />
        )}

        {/* Modal */}
        <MunicipalityModal
          municipality={selectedMunicipality}
          onClose={() => setSelectedMunicipality(null)}
        />

        {/* Sidebar */}
        <Sidebar
          municipalities={municipalities}
          onMunicipalitiesUpdate={setMunicipalities}
        />
      </div>
    </div>
  );
}