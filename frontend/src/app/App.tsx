import { useState } from 'react';
import { Municipality } from './types';
import { RegionMap } from './components/RegionMap';
import { StatusLegend } from './components/StatusLegend';
import { StatisticsCard } from './components/StatisticsCard';
import { MunicipalityModal } from './components/MunicipalityModal';
import { InteractiveMap } from './components/InteractiveMap';
import { Sidebar } from './components/Sidebar';
import { StatisticalReports } from './components/StatisticalReports';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { nirMunicipalities } from './utils/clup-data';

export default function App() {
  const [municipalities] = useState<Municipality[]>(nirMunicipalities);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredMunicipalities =
    filterStatus === 'all'
      ? municipalities
      : municipalities.filter((m) => m.clupStatus === filterStatus);

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
        />
      </div>
    </div>
  );
}