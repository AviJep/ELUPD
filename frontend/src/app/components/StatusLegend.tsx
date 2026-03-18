import { CLUP_STATUS_BG, CLUP_STATUS_LABELS } from '../types';
import type { CLUPStatus } from '../types';

export function StatusLegend() {
  const statuses: CLUPStatus[] = ['updated', 'for-updating', 'no-clup', 'expired'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">CLUP Status Legend</h3>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded ${CLUP_STATUS_BG[status]}`} />
            <span className="text-gray-700">{CLUP_STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        <p>Click on a municipality to view details and update status.</p>
      </div>
    </div>
  );
}
