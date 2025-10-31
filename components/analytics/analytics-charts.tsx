'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useTheme } from 'next-themes';

interface AnalyticsChartsProps {
  timeSeriesData: Array<{ date: string; success: number; failure: number }>;
  networkData: Array<{ name: string; value: number }>;
  statusData: Array<{ name: string; value: number }>;
}

const CHART_COLORS = {
  light: {
    primary: '#16a34a', // green-600
    secondary: '#dc2626', // red-600
    tertiary: '#7c3aed', // violet-600
    quaternary: '#0891b2', // cyan-600
    grid: '#e2e8f0', // slate-200
    text: '#475569', // slate-600
  },
  dark: {
    primary: '#60a5fa', // blue-400
    secondary: '#f87171', // red-400
    tertiary: '#22d3ee', // cyan-400
    quaternary: '#a78bfa', // violet-400
    grid: '#334155', // slate-700
    text: '#cbd5e1', // slate-300
  },
};

const STATUS_COLORS = {
  light: {
    healthy: '#16a34a',
    warning: '#eab308',
    critical: '#dc2626',
    unknown: '#64748b',
  },
  dark: {
    healthy: '#60a5fa',
    warning: '#22d3ee',
    critical: '#f87171',
    unknown: '#94a3b8',
  },
};

export function AnalyticsCharts({ timeSeriesData, networkData, statusData }: AnalyticsChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const statusColors = isDark ? STATUS_COLORS.dark : STATUS_COLORS.light;

  return (
    <div className="space-y-6">
      {/* Health Checks Over Time - Area Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Health Check Trends (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="date"
              stroke={colors.text}
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke={colors.text} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${colors.grid}`,
                borderRadius: '8px',
                color: isDark ? '#e2e8f0' : '#1e293b',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="success"
              stroke={colors.primary}
              strokeWidth={2}
              fill="url(#colorSuccess)"
              name="Successful"
            />
            <Area
              type="monotone"
              dataKey="failure"
              stroke={colors.secondary}
              strokeWidth={2}
              fill="url(#colorFailure)"
              name="Failed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Network Distribution - Bar Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Nodes by Network
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="name"
                stroke={colors.text}
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke={colors.text} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${colors.grid}`,
                  borderRadius: '8px',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
              <Bar dataKey="value" fill={colors.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution - Pie Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Node Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.name.toLowerCase() as keyof typeof statusColors] || colors.tertiary}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${colors.grid}`,
                  borderRadius: '8px',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
