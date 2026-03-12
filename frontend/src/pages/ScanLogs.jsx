import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { ScanResultBadge } from '../components/ScanResultBadge';
import { RiskMeter } from '../components/RiskMeter';
import { formatDate } from '../utils/formatters';
import { Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

export default function ScanLogs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [filters, setFilters] = useState({
    decision: '',
    severity: '',
    agent_id: '',
    limit: 50,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.decision) params.decision = filters.decision;
      if (filters.severity) params.severity = filters.severity;
      if (filters.agent_id) params.agent_id = filters.agent_id;
      params.limit = filters.limit;

      const response = await client.get('/api/v1/dashboard/recent-events', { params });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleExport = () => {
    const csv = [
      ['Time', 'Agent ID', 'Tool Name', 'Decision', 'Severity', 'Risk Score', 'Threat Type'].join(','),
      ...events.map((e) =>
        [
          formatDate(e.created_at),
          e.agent_id,
          e.tool_name,
          e.decision,
          e.severity,
          e.risk_score,
          e.threat_type || 'N/A',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6" data-testid="scan-logs-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Scan Logs
          </h1>
          <p className="text-gray-600 mt-1">Complete history of all scan events</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
          data-testid="export-csv-btn"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.decision}
            onChange={(e) => setFilters({ ...filters, decision: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            data-testid="filter-decision"
          >
            <option value="">All Decisions</option>
            <option value="allow">Allow</option>
            <option value="warn">Warn</option>
            <option value="block">Block</option>
          </select>

          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            data-testid="filter-severity"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>

          <input
            type="text"
            placeholder="Agent ID"
            value={filters.agent_id}
            onChange={(e) => setFilters({ ...filters, agent_id: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            data-testid="filter-agent-id"
          />

          <button
            onClick={fetchEvents}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            data-testid="apply-filters-btn"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Agent ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tool Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Decision</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <React.Fragment key={event.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(event.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{event.agent_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.tool_name}</td>
                      <td className="px-6 py-4">
                        <ScanResultBadge decision={event.decision} />
                      </td>
                      <td className="px-6 py-4 text-sm capitalize text-gray-700">{event.severity}</td>
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
                          <div className="max-w-3xl">
                            <div className="font-semibold text-sm text-gray-700 mb-2">Evidence:</div>
                            <div className="text-sm text-gray-600 pl-4">{event.evidence_summary}</div>
                            {event.threat_type && (
                              <div className="mt-3">
                                <span className="text-xs font-semibold text-gray-500">Threat Type: </span>
                                <span className="text-xs font-mono text-gray-900">{event.threat_type}</span>
                              </div>
                            )}
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
            <p>No scan events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
