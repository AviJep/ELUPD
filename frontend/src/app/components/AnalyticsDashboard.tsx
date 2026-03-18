import { useState } from 'react';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock analytics data
  const metrics = [
    { label: 'Total Updates', value: '156', change: '+12%', trend: 'up' },
    { label: 'Average Response Time', value: '2.4 days', change: '-18%', trend: 'down' },
    { label: 'Compliance Score', value: '87%', change: '+5%', trend: 'up' },
    { label: 'Pending Reviews', value: '23', change: '-8%', trend: 'down' },
  ];

  const recentActivity = [
    { action: 'Bacolod City updated', time: '2 hours ago' },
    { action: 'Dumaguete City status changed', time: '5 hours ago' },
    { action: 'Siquijor compliance review', time: '1 day ago' },
    { action: 'New data uploaded - Bayawan', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end gap-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-600">{metric.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">Compliance Trend</h3>
          <div className="h-40 flex items-end justify-around gap-2">
            {[65, 70, 68, 75, 80, 78, 85, 82, 87, 90, 88, 92].map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-6 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">60%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Updated</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">20%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Updating</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">20%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Non-Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-700">{activity.action}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
