import { Municipality, CLUP_STATUS_BG } from '../types';

interface StatisticsCardProps {
  municipalities: Municipality[];
}

export function StatisticsCard({ municipalities }: StatisticsCardProps) {
  const total = municipalities.length;
  const updated = municipalities.filter(m => m.clupStatus === 'updated').length;
  const forUpdating = municipalities.filter(m => m.clupStatus === 'for-updating').length;
  const noClup = municipalities.filter(m => m.clupStatus === 'no-clup').length;

  const updatedPercentage = total > 0 ? Math.round((updated / total) * 100) : 0;
  const complianceRate = total > 0 ? Math.round((updated / total) * 100) : 0;

  const stats = [
    { label: 'Total Municipalities', value: total, color: 'bg-blue-500' },
    { label: 'Updated', value: updated, color: CLUP_STATUS_BG['updated'] },
    { label: 'For Updating', value: forUpdating, color: CLUP_STATUS_BG['for-updating'] },
    { label: 'No CLUP', value: noClup, color: CLUP_STATUS_BG['no-clup'] },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color} text-white rounded px-3 py-1 mt-2`}>
            {stat.value}
          </p>
        </div>
      ))}
      <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
        <p className="text-sm text-green-800">Compliance Rate</p>
        <p className="text-3xl font-bold text-green-600">{complianceRate}%</p>
      </div>
      <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
        <p className="text-sm text-blue-800">Fully Updated</p>
        <p className="text-3xl font-bold text-blue-600">{updatedPercentage}%</p>
      </div>
    </div>
  );
}
