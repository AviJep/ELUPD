import { useState } from 'react';
import { Sidebar } from './components/Sidebar';

// Mock data for Negros Island Region including Siquijor
// (Unused, but kept for future use)
const initialMunicipalities = [
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        {/* Sidebar Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg"
          >
            Open Sidebar
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
}

        {/* ...existing code... */}