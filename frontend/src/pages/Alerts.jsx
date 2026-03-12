import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Eye,
  X,
  ExternalLink
} from 'lucide-react';
import client from '../api/client';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [filterStatus, filterSeverity]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterSeverity !== 'all') params.append('severity', filterSeverity);
      
      const response = await client.get(`/api/v1/alerts/?${params}`);
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlertStatus = async (alertId, newStatus) => {
    try {
      await client.patch(`/api/v1/alerts/${alertId}`, { status: newStatus });
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: { bg: 'var(--color-critical-bg)', color: 'var(--color-critical)', icon: XCircle },
      high: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', icon: AlertCircle },
      medium: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: AlertTriangle },
      low: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', icon: Bell }
    };
    const style = styles[severity] || styles.low;
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
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
      acknowledged: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
      resolved: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' }
    };
    const style = styles[status] || styles.open;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      alert.title?.toLowerCase().includes(query) ||
      alert.description?.toLowerCase().includes(query)
    );
  });

  const alertStats = {
    open: alerts.filter(a => a.status === 'open').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  return (
    <div className="page-transition" data-testid="alerts-page">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 700, 
          color: 'var(--color-text-primary)',
          marginBottom: '4px'
        }}>
          Security Alerts
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Monitor and manage security incidents
        </p>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle style={{ width: '18px', height: '18px', color: 'var(--color-danger)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Open
            </span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
            {alertStats.open}
          </div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-warning-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Eye style={{ width: '18px', height: '18px', color: 'var(--color-warning)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Acknowledged
            </span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
            {alertStats.acknowledged}
          </div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-success-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle style={{ width: '18px', height: '18px', color: 'var(--color-success)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Resolved
            </span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
            {alertStats.resolved}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
            data-testid="search-alerts"
          />
        </div>

        {/* Status Filter */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowSeverityDropdown(false); }}
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
            <Filter style={{ width: '16px', height: '16px' }} />
            Status: {filterStatus === 'all' ? 'All' : filterStatus}
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>
          {showStatusDropdown && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowStatusDropdown(false)} />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '140px',
                zIndex: 20,
                overflow: 'hidden'
              }}>
                {['all', 'open', 'acknowledged', 'resolved'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setFilterStatus(option); setShowStatusDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: filterStatus === option ? 'var(--color-surface)' : 'transparent',
                      border: 'none',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {option === 'all' ? 'All Statuses' : option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Severity Filter */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowSeverityDropdown(!showSeverityDropdown); setShowStatusDropdown(false); }}
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
            Severity: {filterSeverity === 'all' ? 'All' : filterSeverity}
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>
          {showSeverityDropdown && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowSeverityDropdown(false)} />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '140px',
                zIndex: 20,
                overflow: 'hidden'
              }}>
                {['all', 'critical', 'high', 'medium', 'low'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setFilterSeverity(option); setShowSeverityDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: filterSeverity === option ? 'var(--color-surface)' : 'transparent',
                      border: 'none',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {option === 'all' ? 'All Severities' : option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alerts List */}
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
        ) : filteredAlerts.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Bell style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              No alerts found
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: '300px', margin: '0 auto' }}>
              {searchQuery || filterStatus !== 'all' || filterSeverity !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Great! No security incidents to report'}
            </p>
          </div>
        ) : (
          <div>
            {filteredAlerts.map((alert, index) => (
              <div 
                key={alert.id || index}
                style={{
                  padding: '20px 24px',
                  borderBottom: index < filteredAlerts.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onClick={() => setSelectedAlert(alert)}
                data-testid={`alert-row-${index}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: 'var(--text-base)', 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary)',
                      marginBottom: '6px'
                    }}>
                      {alert.title || 'Untitled Alert'}
                    </h3>
                    <p style={{ 
                      fontSize: 'var(--text-sm)', 
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.5
                    }}>
                      {alert.description || 'No description provided'}
                    </p>
                  </div>
                  <ExternalLink style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: '16px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: '12px', height: '12px' }} />
                    {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <>
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 50
            }}
            onClick={() => setSelectedAlert(null)}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 51,
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '24px', 
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  {selectedAlert.title}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {getSeverityBadge(selectedAlert.severity)}
                  {getStatusBadge(selectedAlert.status)}
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X style={{ width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 180px)' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Description
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                  {selectedAlert.description || 'No description provided'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Alert ID
                  </div>
                  <code style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {selectedAlert.id}
                  </code>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Created
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                    {selectedAlert.created_at ? new Date(selectedAlert.created_at).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
                Update Status
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['open', 'acknowledged', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateAlertStatus(selectedAlert.id, status)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: selectedAlert.status === status ? 'var(--color-brand)' : 'var(--color-surface)',
                      color: selectedAlert.status === status ? 'white' : 'var(--color-text-primary)',
                      border: selectedAlert.status === status ? 'none' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Alerts;
