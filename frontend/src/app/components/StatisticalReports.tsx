import { Municipality } from '../types';

interface StatisticalReportsProps {
  municipalities: Municipality[];
}

export function StatisticalReports({ municipalities }: StatisticalReportsProps) {
  const total = municipalities.length;
  
  // Statistics by province
  const provinces = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];
  
  const getProvinceStats = (province: string) => {
    const provMunicipalities = municipalities.filter(m => m.province === province);
    return {
      total: provMunicipalities.length,
      updated: provMunicipalities.filter(m => m.clupStatus === 'updated').length,
      updating: provMunicipalities.filter(m => m.clupStatus === 'for-updating').length,
      nonCompliance: provMunicipalities.filter(m => m.clupStatus === 'no-clup').length,
    };
  };

  // Calculate compliance rate
  const updatedCount = municipalities.filter(m => m.clupStatus === 'updated').length;
  const updatingCount = municipalities.filter(m => m.clupStatus === 'for-updating').length;
  const nonComplianceCount = municipalities.filter(m => m.clupStatus === 'no-clup').length;
  const complianceRate = total > 0 ? ((updatedCount + updatingCount) / total * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800">Compliance Rate</h4>
          <p className="text-3xl font-bold text-green-600">{complianceRate}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800">Non-Compliance</h4>
          <p className="text-3xl font-bold text-red-600">{nonComplianceCount}</p>
          <p className="text-sm text-red-600">{total > 0 ? ((nonComplianceCount / total) * 100).toFixed(1) : 0}% of total</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">Total Municipalities</h4>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
      </div>

      {/* Province Breakdown */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Province Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {provinces.map((province) => {
            const stats = getProvinceStats(province);
            const provinceComplianceRate = stats.total > 0 
              ? (((stats.updated + stats.updating) / stats.total) * 100).toFixed(1) 
              : '0';
            
            return (
              <div key={province} className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold text-gray-800 mb-3">{province}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium text-green-600">{stats.updated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updating:</span>
                    <span className="font-medium text-orange-600">{stats.updating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Non-Compliance:</span>
                    <span className="font-medium text-red-600">{stats.nonCompliance}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Compliance:</span>
                      <span>{provinceComplianceRate}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${provinceComplianceRate}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Compliance List */}
      {nonComplianceCount > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-red-800 mb-4">Municipalities Requiring Attention</h3>
          <div className="bg-red-50 rounded-lg border border-red-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-4 py-2 text-left text-red-800">Municipality</th>
                  <th className="px-4 py-2 text-left text-red-800">Province</th>
                  <th className="px-4 py-2 text-left text-red-800">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {municipalities
                  .filter(m => m.clupStatus === 'no-clup')
                  .map((municipality) => (
                    <tr key={municipality.id} className="border-t border-red-200">
                      <td className="px-4 py-2 font-medium">{municipality.name}</td>
                      <td className="px-4 py-2">{municipality.province}</td>
                      <td className="px-4 py-2">{municipality.lastUpdate}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
