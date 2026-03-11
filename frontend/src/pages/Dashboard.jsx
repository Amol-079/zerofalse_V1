import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { ScanResultBadge } from '../components/ScanResultBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Activity, Shield, AlertTriangle, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';

export default function Dashboard() {
  const { stats, recentEvents, threatBreakdown, loading } = useDashboard();
  const [expandedEvent, setExpandedEvent] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to Protect Your Agents
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first API key and start scanning tool calls
          </p>
          <button
            onClick={() => window.location.href = '/api-keys'}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Create API Key
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Scans Today',
      value: stats.total_scans_today,
      icon: Activity,
      color: 'blue',
    },
    {
      title: 'Blocked Today',
      value: stats.blocked_today,
      icon: Shield,
      color: 'red',
    },
    {
      title: 'Open Alerts',
      value: stats.open_alerts,
      icon: AlertTriangle,
      color: 'amber',
    },
    {
      title: 'Active Agents',
      value: stats.active_agents,
      icon: Users,
      color: 'green',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', icon: 'text-amber-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
  };

  const pieData = threatBreakdown?.by_type
    ? Object.entries(threatBreakdown.by_type).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Overview
        </h1>
        <p className="text-gray-600 mt-1">Monitor your AI agent security in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colors = colorMap[card.color];
          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              data-testid={`stat-card-${card.title.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{card.title}</span>
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                {card.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Scan Activity — Last 14 Days
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="scans" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Total Scans" />
              <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} name="Blocked" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Threats by Type
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No threat data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Recent Scan Events
          </h3>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="recent-events-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agent ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tool Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Decision</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk Score</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentEvents.slice(0, 10).map((event) => (
                  <React.Fragment key={event.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatRelativeTime(event.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{event.agent_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.tool_name}</td>
                      <td className="px-6 py-4">
                        <ScanResultBadge decision={event.decision} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize text-gray-700">{event.severity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <RiskMeter score={event.risk_score} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {expandedEvent === event.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                    </tr>
                    {expandedEvent === event.id && event.evidence_summary && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-700 mb-2">Evidence:</div>
                            <div className="text-gray-600 pl-4">{event.evidence_summary}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No scan events yet. Start making API calls to see data here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
