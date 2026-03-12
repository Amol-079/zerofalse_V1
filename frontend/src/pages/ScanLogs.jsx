import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronRight,
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  FileText,
  RefreshCw,
  X
} from 'lucide-react';
import client from '../api/client';

const ScanLogs = () => {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDecision, setFilterDecision] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    fetchScans();
  }, [pagination.page, filterDecision]);

  const fetchScans = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        skip: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      });
      if (filterDecision !== 'all') {
        params.append('decision', filterDecision);
      }
      const response = await client.get(`/api/v1/scan/history?${params}`);
      setScans(response.data.scans || []);
      setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionBadge = (decision) => {
    const styles = {
      allowed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: CheckCircle },
      blocked: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', icon: XCircle },
      flagged: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: AlertTriangle }
    };
    const style = styles[decision] || styles.allowed;
    const Icon = style.icon;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        textTransform: 'capitalize'
      }}>
        <Icon style={{ width: '12px', height: '12px' }} />
        {decision}
      </span>
    );
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'var(--color-danger)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const filteredScans = scans.filter(scan => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scan.tool_name?.toLowerCase().includes(query) ||
      scan.threat_type?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="page-transition" data-testid="scan-logs-page">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 700, 
          color: 'var(--color-text-primary)',
          marginBottom: '4px'
        }}>
          Scan Logs
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Complete history of all tool call inspections
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '18px', 
            height: '18px', 
            color: 'var(--color-text-muted)' 
          }} />
          <input
            type="text"
            placeholder="Search by tool name or threat type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '44px',
              boxSizing: 'border-box'
            }}
            data-testid="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: 'var(--color-bg)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
            data-testid="filter-btn"
          >
            <Filter style={{ width: '16px', height: '16px' }} />
            {filterDecision === 'all' ? 'All Results' : filterDecision}
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>
          
          {showFilterDropdown && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setShowFilterDropdown(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '150px',
                zIndex: 20,
                overflow: 'hidden'
              }}>
                {['all', 'allowed', 'blocked', 'flagged'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilterDecision(option);
                      setShowFilterDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: filterDecision === option ? 'var(--color-surface)' : 'transparent',
                      border: 'none',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {option === 'all' ? 'All Results' : option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={fetchScans}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            cursor: 'pointer'
          }}
          data-testid="refresh-btn"
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} />
          Refresh
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            cursor: 'pointer'
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Export
        </button>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-brand)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : filteredScans.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <FileText style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              No scan logs found
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: '300px', margin: '0 auto' }}>
              {searchQuery ? 'Try adjusting your search or filters' : 'Start scanning tool calls to see logs here'}
            </p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface)' }}>
                  <th style={{ width: '40px', padding: '14px 16px' }}></th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tool Name
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Decision
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Risk Score
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Threat Type
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan, index) => (
                  <React.Fragment key={scan.id || index}>
                    <tr 
                      style={{ 
                        borderTop: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        backgroundColor: expandedRow === scan.id ? 'var(--color-surface)' : 'transparent',
                        transition: 'var(--transition-fast)'
                      }}
                      onClick={() => setExpandedRow(expandedRow === scan.id ? null : scan.id)}
                      data-testid={`scan-row-${index}`}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <ChevronRight style={{ 
                          width: '16px', 
                          height: '16px', 
                          color: 'var(--color-text-muted)',
                          transform: expandedRow === scan.id ? 'rotate(90deg)' : 'none',
                          transition: 'var(--transition-fast)'
                        }} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <code style={{ 
                          fontSize: 'var(--text-sm)', 
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 500,
                          color: 'var(--color-text-primary)'
                        }}>
                          {scan.tool_name || 'unknown'}
                        </code>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {getDecisionBadge(scan.decision)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '60px', 
                            height: '6px', 
                            backgroundColor: 'var(--color-surface-2)', 
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${scan.risk_score || 0}%`,
                              height: '100%',
                              backgroundColor: getRiskColor(scan.risk_score),
                              borderRadius: 'var(--radius-full)'
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: 'var(--text-xs)', 
                            fontWeight: 600,
                            color: getRiskColor(scan.risk_score),
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {scan.risk_score || 0}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          fontSize: 'var(--text-sm)', 
                          color: scan.threat_type ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                        }}>
                          {scan.threat_type || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)' }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                            {scan.created_at ? new Date(scan.created_at).toLocaleString() : 'Unknown'}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === scan.id && (
                      <tr>
                        <td colSpan="6" style={{ padding: 0 }}>
                          <div style={{ 
                            padding: '20px 24px', 
                            backgroundColor: 'var(--color-surface)',
                            borderTop: '1px solid var(--color-border)'
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                              <div>
                                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                                  Scan ID
                                </div>
                                <code style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                                  {scan.id}
                                </code>
                              </div>
                              <div>
                                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                                  Latency
                                </div>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                  {scan.latency_ms || 0}ms
                                </span>
                              </div>
                              {scan.explanation && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Analysis
                                  </div>
                                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                                    {scan.explanation}
                                  </p>
                                </div>
                              )}
                              {scan.input_args && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Input Arguments
                                  </div>
                                  <pre style={{ 
                                    padding: '12px',
                                    backgroundColor: 'var(--color-navy)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-xs)',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#e2e8f0',
                                    overflow: 'auto',
                                    maxHeight: '150px'
                                  }}>
                                    {JSON.stringify(scan.input_args, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                padding: '16px 24px', 
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: pagination.page === 1 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                      cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === totalPages}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: pagination.page === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                      cursor: pagination.page === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScanLogs;
