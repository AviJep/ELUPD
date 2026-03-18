import { Municipality, CLUP_STATUS_BG, CLUP_STATUS_LABELS } from '../types';
import type { CLUPStatus } from '../types';

interface MunicipalityModalProps {
  municipality: Municipality | null;
  onClose: () => void;
}

export function MunicipalityModal({ municipality, onClose }: MunicipalityModalProps) {
  if (!municipality) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{municipality.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Province</p>
            <p className="text-lg font-medium text-gray-800">{municipality.province}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-white font-medium ${CLUP_STATUS_BG[municipality.clupStatus]}`}>
              {CLUP_STATUS_LABELS[municipality.clupStatus]}
            </span>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Last Update</p>
            <p className="text-lg font-medium text-gray-800">{municipality.lastUpdate}</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
